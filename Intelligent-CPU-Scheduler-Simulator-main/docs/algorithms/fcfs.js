export function calculateFCFS(processes) {
    const processQueue = JSON.parse(JSON.stringify(processes));
    processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let timeline = [];

    processQueue.forEach(process => {
        if (currentTime < process.arrivalTime) {
            timeline.push({
                processId: 'idle',
                startTime: currentTime,
                endTime: process.arrivalTime
            });
            currentTime = process.arrivalTime;
        }

        process.responseTime = currentTime - process.arrivalTime;
        process.startTime = currentTime;
        process.waitingTime = process.responseTime;
        currentTime += process.burstTime;
        process.finishTime = currentTime;
        process.turnaroundTime = process.finishTime - process.arrivalTime;

        timeline.push({
            processId: process.id,
            startTime: process.startTime,
            endTime: process.finishTime
        });
    });

    return { timeline, processes: processQueue };
}
