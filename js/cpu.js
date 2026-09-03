class CPU {
    constructor() {
        this.registers = [0,0,0,0];
        this.pc = 0;
        this.memory = new Array(256).fill(0);
        this.halted = false;
    }

    fetch() {
        // instrucao ocupa 3 "bytes"
        return [
            this.memory[this.pc],
            this.memory[this.pc + 1],
            this.memory[this.pc + 2]
        ];
    }

    decode(opcode) {

    }

    execute(instruction) {

    }

    step() {
        const opcode = this.fetch();
        const instruction = this.decode(opcode);
        this.execute(instruction);
    }
}

// useful for fetch and decode cycle
const opcodeMap = new Map([
    ["LOAD",  0x01],
    ["ADD",   0x02],
    ["SUB",   0x03],
    ["STORE", 0x04],
    ["JMP",   0x05],
    ["HALT",  0xFF]
]);

const instructionMap = new Map(
    [...opcodeMap].map(([name, opcode]) => [opcode, name])
);

class Instruction {
    constructor(instruction, register, data) {
        this.instruction = instruction;
        this.register = registers;
        this.data = data
    }

    get(opcode) {
        return instructionMap.get(opcode);
    }
}
