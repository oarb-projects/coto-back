class graphSection {
    constructor(id, urla, limitA, limitB, min, max, width) {
        this.id = id;

        this.urla = urla;

        //Wanted Data
        this.limitA = limitA;
        this.limitB = limitB;

        //Limits of the possible values
        this.min = min;
        this.max = max;

        //Width of each bar, this means the range
        this.width = width;
    }
}

let parameters = [];

parameters.push(new graphSection('CR', 'https://coto-mobile.herokuapp.com/api/coil_resistance', 35, 45, 0, 100, 0.5));
parameters.push(new graphSection('OV', 'https://coto-mobile.herokuapp.com/api/operate_voltage', 1.10, 3.70, 0.05, 100, 0.1));
parameters.push(new graphSection('RV', 'https://coto-mobile.herokuapp.com/api/release_voltage', 1.10, 3.70, 0, 100, 0.1));
parameters.push(new graphSection('SCR', 'https://coto-mobile.herokuapp.com/api/scr', 0.02, 0.2, 0, 100, 0.01));
parameters.push(new graphSection('OT', 'https://coto-mobile.herokuapp.com/api/operate_time', -200, 4000, -300, 6000, 100));
parameters.push(new graphSection('RT', 'https://coto-mobile.herokuapp.com/api/release_time', -100, 2000, -300, 4000, 50));