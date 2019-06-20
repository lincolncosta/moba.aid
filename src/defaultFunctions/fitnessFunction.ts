export const fitnessFunction = (strategy: string, data: any): number => {
    let fitvalue: any = 0;
    let attack = 0;
    let movspeed = 0;

    if(strategy == 'ofensiva'){
        attack = attack + data['stats']['attackdamage'];
        movspeed = movspeed + data['stats']['movespeed'];

        fitvalue = attack + movspeed;
        fitvalue = (fitvalue * 100 / 210).toFixed(2);
    }

    return fitvalue;
}
