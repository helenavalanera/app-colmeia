import type { Mission } from '../types';

export type MissionProfile = {
  nome: string;
  favosSaldo: number;
  missionsCompleted: number;
};

export function isMissionComplete(mission: Mission): boolean {
  return mission.favos.length > 0 && mission.favos.every((favo) => favo.encontrado);
}

export function getMissionReward(mission: Mission): number {
  return Math.max(1, mission.participantes || 1);
}

export function completeMission(
  profile: MissionProfile,
  mission: Mission
): { profile: MissionProfile; mission: Mission } | null {
  if (mission.status === 'concluida' || isMissionComplete(mission) === false) {
    return null;
  }

  const nextMission = { ...mission, status: 'concluida' as const };
  const reward = getMissionReward(mission);
  const nextProfile = {
    ...profile,
    favosSaldo: profile.favosSaldo + reward,
    missionsCompleted: profile.missionsCompleted + 1,
  };

  return { profile: nextProfile, mission: nextMission };
}
