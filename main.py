import sys
import os
import typing as t

from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.append(os.path.abspath('app/geneticalgorithm'))

import GeneticAlgorithm as GAService

app = FastAPI(title="MOBA AID", docs_url="/api/docs", openapi_url="/api")

origins = [
    "http://localhost:3000",
    "https://moba-aid.vercel.app",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StartRequest(BaseModel):
    NEEDED_RETURN_SIZE: int
    ENEMY_HEROES: Optional[t.List] = []
    BANNED_HEROES: Optional[t.List] = []
    PICKED_HEROES: Optional[t.Dict] = {}


class OptimizedTeam(BaseModel):
    top: Optional[int]
    jungle: Optional[int]
    mid: Optional[int]
    adc: Optional[int]
    support: Optional[int]


def validate_request_params(startRequest):
    if startRequest.NEEDED_RETURN_SIZE > 5 or startRequest.NEEDED_RETURN_SIZE < 1:
        raise HTTPException(
            status_code=400,
            detail="NEEDED_RETURN_SIZE must be a value between 1 and 5.",
            headers={
                "X-Error": "Incorrect value for NEEDED_RETURN_SIZE."},
        )

    if(startRequest.ENEMY_HEROES):
        non_numeric_enemy_len = len(
            [s for s in startRequest.ENEMY_HEROES if not str(s).isdigit()])

        if non_numeric_enemy_len > 0:
            raise HTTPException(
                status_code=400,
                detail="ENEMY_HEROES values must be an integer according to the champions id.",
                headers={
                    "X-Error": "Incorrect value for ENEMY_HEROES."},
            )

    if(startRequest.PICKED_HEROES):
        lanes = ['top', 'jungle', 'mid', 'adc', 'support']
        lanes_picked = list(startRequest.PICKED_HEROES.keys())
        diff_lanes_len = len(list((set(lanes_picked) - set(lanes))))

        if diff_lanes_len > 0:
            raise HTTPException(
                status_code=400,
                detail="PICKED_HEROES keys must be top, jungle, mid, adc or support.",
                headers={
                    "X-Error": "Incorrect key for PICKED_HEROES."},
            )

        picked_list = list(startRequest.PICKED_HEROES.values())
        non_numeric_picked_len = len(
            [s for s in picked_list if not str(s).isdigit()])

        if non_numeric_picked_len > 0:
            raise HTTPException(
                status_code=400,
                detail="PICKED_HEROES values must be an integer according to the champions id.",
                headers={
                    "X-Error": "Incorrect value for PICKED_HEROES."},
            )

    if(startRequest.BANNED_HEROES):
        non_numeric_banned_len = len(
            [s for s in startRequest.BANNED_HEROES if not str(s).isdigit()])

        if non_numeric_banned_len > 0:
            raise HTTPException(
                status_code=400,
                detail="BANNED_HEROES values must be an integer according to the champions id.",
                headers={
                    "X-Error": "Incorrect value for BANNED_HEROES."},
            )


@app.get("/")
def info():
    """
    Health check and last release info.
    """
    return {"MOBA AID is working fine. Last updated on 16:00 12/Jul/2021."}


@app.post("/suggest",
          response_model=OptimizedTeam
          )
def suggest(startRequest: StartRequest):
    """
    Executes Genetic Algorithm to suggest your draft next step.
    """

    validate_request_params(startRequest)

    startRequest.BANNED_HEROES.append(startRequest.ENEMY_HEROES)
    next_picks = GAService.run_ga(startRequest.NEEDED_RETURN_SIZE,
                                  startRequest.ENEMY_HEROES, startRequest.PICKED_HEROES, startRequest.BANNED_HEROES)
    team = OptimizedTeam()

    for lane, championId in next_picks.items():
        setattr(team, lane, championId)

    return team
