
export class MonteCarloPI {
    constructor(
        public senderid: string,
        public id: string,
        public atomid: string,
        public payload: Payload
    ) { }
}

export class Payload {
    constructor(
        public tosses: number
    ) { }
}


