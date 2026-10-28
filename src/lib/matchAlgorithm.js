/**
 * SkillSwap Intelligent Matching Engine
 * Computes reciprocal and complementary skill match scores with transparent explanations.
 */

/**
 * Calculates matching score and explanation between current user and target user.
 * 
 * @param {string} currentUserId 
 * @param {Array} currentUserSkills - array of user_skills for current user
 * @param {Object} targetProfile - profile object of the candidate
 * @param {Array} targetUserSkills - array of user_skills for candidate
 * @returns {Object|null} Match calculation result or null if no overlap
 */
export function calculateMatch(currentUserId, currentUserSkills, targetProfile, targetUserSkills) {
  if (!targetProfile || targetProfile.id === currentUserId || !targetProfile.isActive) {
    return null;
  }

  // Current user's skills
  const myOffered = currentUserSkills.filter(s => s.type === 'offered');
  const myWanted = currentUserSkills.filter(s => s.type === 'wanted');

  // Target user's skills
  const targetOffered = targetUserSkills.filter(s => s.type === 'offered');
  const targetWanted = targetUserSkills.filter(s => s.type === 'wanted');

  // 1. What current user can teach target user
  // (myOffered skillId matches targetWanted skillId)
  const youTeach = [];
  myOffered.forEach(myOff => {
    const matchWanted = targetWanted.find(tWant => tWant.skillId === myOff.skillId || tWant.skillName?.toLowerCase() === myOff.skillName?.toLowerCase());
    if (matchWanted) {
      youTeach.push({
        skillId: myOff.skillId,
        skillName: myOff.skillName,
        myProficiency: myOff.proficiency,
        theirInterest: matchWanted.proficiency || 'Beginner'
      });
    }
  });

  // 2. What target user can teach current user
  // (targetOffered skillId matches myWanted skillId)
  const theyTeach = [];
  targetOffered.forEach(tOff => {
    const matchWanted = myWanted.find(myWant => myWant.skillId === tOff.skillId || myWant.skillName?.toLowerCase() === tOff.skillName?.toLowerCase());
    if (matchWanted) {
      theyTeach.push({
        skillId: tOff.skillId,
        skillName: tOff.skillName,
        theirProficiency: tOff.proficiency,
        myInterest: matchWanted.proficiency || 'Beginner'
      });
    }
  });

  const isReciprocal = youTeach.length > 0 && theyTeach.length > 0;
  const isOneWayTheyTeach = youTeach.length === 0 && theyTeach.length > 0;
  const isOneWayYouTeach = youTeach.length > 0 && theyTeach.length === 0;

  // No overlapping skill synergy
  if (!isReciprocal && !isOneWayTheyTeach && !isOneWayYouTeach) {
    return null;
  }

  // Calculate score
  let baseScore = 0;
  let explanation = '';

  if (isReciprocal) {
    // Reciprocal starts at 85
    baseScore = 85;
    // Extra points for multiple mutual skills
    baseScore += Math.min((youTeach.length + theyTeach.length - 2) * 4, 8);

    // Bonus for high proficiency in offered skills
    const expertOffered = theyTeach.some(t => t.theirProficiency === 'Expert' || t.theirProficiency === 'Advanced');
    if (expertOffered) baseScore += 4;

    // Bonus for high rating
    if (targetProfile.rating >= 4.9) baseScore += 2;

    baseScore = Math.min(baseScore, 99);

    const teachStr = youTeach.map(s => s.skillName).join(', ');
    const learnStr = theyTeach.map(s => s.skillName).join(', ');
    explanation = `Mutual Match: You can teach ${teachStr}, while ${targetProfile.fullName} can teach you ${learnStr}.`;
  } else if (isOneWayTheyTeach) {
    // They offer what you want to learn
    baseScore = 65;
    baseScore += Math.min((theyTeach.length - 1) * 5, 10);
    if (targetProfile.rating >= 4.8) baseScore += 3;

    const learnStr = theyTeach.map(s => s.skillName).join(', ');
    explanation = `${targetProfile.fullName} offers ${learnStr}, which you are looking to learn.`;
  } else {
    // You offer what they want
    baseScore = 55;
    baseScore += Math.min((youTeach.length - 1) * 4, 8);
    const teachStr = youTeach.map(s => s.skillName).join(', ');
    explanation = `You have skills (${teachStr}) that ${targetProfile.fullName} is actively looking to learn.`;
  }

  return {
    targetProfile,
    score: baseScore,
    isReciprocal,
    isOneWayTheyTeach,
    isOneWayYouTeach,
    matchType: isReciprocal ? 'reciprocal' : (isOneWayTheyTeach ? 'one_way_learn' : 'one_way_teach'),
    youTeach,
    theyTeach,
    explanation,
    targetOffered,
    targetWanted
  };
}

/**
 * Returns prioritized list of matches for current user across all members
 */
export function getRecommendedMatches(currentUserId, allProfiles, allUserSkills) {
  const currentUserSkills = allUserSkills.filter(s => s.userId === currentUserId);
  const matches = [];

  allProfiles.forEach(profile => {
    if (profile.id === currentUserId) return;
    const targetSkills = allUserSkills.filter(s => s.userId === profile.id);
    const match = calculateMatch(currentUserId, currentUserSkills, profile, targetSkills);
    if (match) {
      matches.push(match);
    }
  });

  // Sort: Reciprocal first, then highest score, then highest rating
  matches.sort((a, b) => {
    if (a.isReciprocal && !b.isReciprocal) return -1;
    if (!a.isReciprocal && b.isReciprocal) return 1;
    if (b.score !== a.score) return b.score - a.score;
    return b.targetProfile.rating - a.targetProfile.rating;
  });

  return matches;
}
