import sys
import os
import typing as t

from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel

sys.path.append(os.path.abspath('app/geneticalgorithm'))

import GeneticAlgorithm as GAService

app = FastAPI()


class StartRequest(BaseModel):
    strategy: str
    NEEDED_RETURN_SIZE: int
    ENEMY_HEROES: Optional[t.List] = []
    PICKED_HEROES: Optional[t.Dict] = {}

class OptimizedTeam(BaseModel):
    top: Optional[int]
    jungle:Optional[int]
    mid: Optional[int]
    carry: Optional[int]
    support: Optional[int]

@app.get("/")
def health_check():
    return {"Hello": "World"}


@app.post("/ga",
    response_model=OptimizedTeam
)
def run_ga(startRequest: StartRequest):
    next_picks = GAService.run_ga(startRequest.strategy, startRequest.NEEDED_RETURN_SIZE,
                                  startRequest.ENEMY_HEROES, startRequest.PICKED_HEROES)    
    team = OptimizedTeam()

    for lane, championId in next_picks.items():                                  
        setattr(team, lane, championId)

    return team
