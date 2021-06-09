import sys
import os
import typing as t

from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel

sys.path.append(os.path.abspath('app/geneticalgorithm'))

import GeneticAlgorithm as GAService

app = FastAPI(title="MOBA AID", docs_url="/api/docs", openapi_url="/api")


class StartRequest(BaseModel):
    NEEDED_RETURN_SIZE: int
    ENEMY_HEROES: Optional[t.List] = []
    BANNED_HEROES: Optional[t.List] = []
    PICKED_HEROES: Optional[t.Dict] = {}

class OptimizedTeam(BaseModel):
    top: Optional[int]
    jungle:Optional[int]
    mid: Optional[int]
    carry: Optional[int]
    supp: Optional[int]

@app.get("/")
def health_check():
    """
    Health check and last release info.
    """
    return {"MOBA AID is working fine. Last updated on 09/06/2021."}


@app.post("/ga",
    response_model=OptimizedTeam
)
def run_ga(startRequest: StartRequest):
    """
    Executes GA to suggest your draft next step.
    """
    next_picks = GAService.run_ga(startRequest.NEEDED_RETURN_SIZE,
                                  startRequest.ENEMY_HEROES, startRequest.PICKED_HEROES, startRequest.BANNED_HEROES)
    team = OptimizedTeam()

    for lane, championId in next_picks.items():                                  
        setattr(team, lane, championId)

    return team
