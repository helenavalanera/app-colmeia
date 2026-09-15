import { describe, expect, it } from 'vitest';
import type { Mission } from '../types';
import { completeMission, getMissionReward, isMissionComplete } from './missionLogic';

describe('missionLogic', () => {
  it('awards a mission reward only once and increments completion count once', () => {
    const mission: Mission = {
      id: 'agua-que-a-escola-usa',
      titulo: 'Água que a escola usa',
      disciplinas: ['Ciências'],
      participantes: 4,
      prazo: '24 SET',
      status: 'em-andamento',
      precisamColaborar: 0,
      favos: [
        { id: 'torneiras', nome: 'Torneiras', encontrado: true },
        { id: 'banheiros', nome: 'Banheiros', encontrado: true },
        { id: 'horta', nome: 'Horta', encontrado: true },
      ],
    };

    const profile = { nome: 'Ana', favosSaldo: 3, missionsCompleted: 1 };

    const first = completeMission(profile, mission);
    expect(first).not.toBeNull();
    expect(first?.profile.favosSaldo).toBe(7);
    expect(first?.profile.missionsCompleted).toBe(2);
    expect(first?.mission.status).toBe('concluida');

    const second = completeMission(first!.profile, first!.mission);
    expect(second).toBeNull();
  });

  it('marks a mission as complete only when all favos are found', () => {
    const mission: Mission = {
      id: 'x',
      titulo: 'x',
      disciplinas: ['Ciências'],
      participantes: 4,
      prazo: '24 SET',
      status: 'em-andamento',
      precisamColaborar: 0,
      favos: [
        { id: 'a', nome: 'A', encontrado: true },
        { id: 'b', nome: 'B', encontrado: false },
      ],
    };

    expect(isMissionComplete(mission)).toBe(false);
    expect(getMissionReward(mission)).toBe(4);
  });
});
