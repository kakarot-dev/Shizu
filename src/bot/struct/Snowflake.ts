
class Snowflake {

 static* snowflakeGenerator(machineId: number) {
    let seq = 0n;
    const shiftLeftTime = 22n;
    const machine = BigInt(machineId) << 12n;
    let lastTime = BigInt(Date.now());
    while (true) {
        try {
            seq++;
            const time = BigInt(Date.now());
            const shiftedTime = time << shiftLeftTime;
            if (time === lastTime && seq >= 4096n) throw Error('Exceeded 4096 ids in 1 millisecond.')
            if (time !== lastTime) seq = 0n;
            const id = BigInt.asUintN(64, shiftedTime | machine | seq);
            lastTime = time;
            yield id.toString();
        } catch (e) {
            console.log(e);
            yield new Error('Failed to generate snowflake id.');
        }
    }
}
}