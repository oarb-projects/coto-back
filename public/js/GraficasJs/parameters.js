class graphSection {
    constructor(id, name, urla, scaleUnits, limitA, limitB, min, max, width) {
        this.id = id;
        this.name = name;

        this.urla = urla;
        this.scaleUnits = scaleUnits;

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

parameters.push(new graphSection('CR', "Coil Resistance", 'https://coto-mobile.herokuapp.com/api/coil_resistance', "Ohms", 35, 45, 0, 100, 0.5));
parameters.push(new graphSection('OV', "Operate Voltage", 'https://coto-mobile.herokuapp.com/api/operate_voltage', "Volts", 1.10, 3.70, 0.05, 100, 0.1));
parameters.push(new graphSection('RV', "Release Voltage", 'https://coto-mobile.herokuapp.com/api/release_voltage', "Volts", 1.10, 3.70, 0, 100, 0.1));
parameters.push(new graphSection('SCR', "Static Contact Resistance", 'https://coto-mobile.herokuapp.com/api/scr', "Ohms", 0.02, 0.2, 0, 100, 0.01));
parameters.push(new graphSection('OT', "Operate Time", 'https://coto-mobile.herokuapp.com/api/operate_time', "Usecs", -200, 4000, -600, 6000, 100));
parameters.push(new graphSection('RT', "Release Time", 'https://coto-mobile.herokuapp.com/api/release_time', "Usecs", -100, 2000, -400, 4000, 50));