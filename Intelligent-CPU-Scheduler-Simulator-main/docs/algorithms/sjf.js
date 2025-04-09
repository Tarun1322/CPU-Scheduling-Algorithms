export function calculateSJF(processes) {
    const processQueue = JSON.parse(JSON.stringify(processes));
    processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let completed = 0;
    let currentTime = 0;
    const n = processQueue.length;
    const isCompleted = Array(n).fill(false);
    const timeline = [];

    while (completed !== n) {
        let idx = -1;
        let minBurst = Infinity;

        processQueue.forEach((process, i) => {
            if (process.arrivalTime <= currentTime && !isCompleted[i]) {
                if (process.burstTime < minBurst) {
                    minBurst = process.burstTime;
                    idx = i;
                } else if (process.burstTime === minBurst) {
                    if (process.arrivalTime < processQueue[idx].arrivalTime) {
                        idx = i;
                    }
                }
            }
        });

        if (idx !== -1) {
            if (currentTime < processQueue[idx].arrivalTime) {
                timeline.push({
                    processId: 'idle',
                    startTime: currentTime,
                    endTime: processQueue[idx].arrivalTime
                });
                currentTime = processQueue[idx].arrivalTime;
            }

            processQueue[idx].startTime = currentTime;
            processQueue[idx].responseTime = currentTime - processQueue[idx].arrivalTime;
            processQueue[idx].waitingTime = processQueue[idx].responseTime;
            currentTime += processQueue[idx].burstTime;
            processQueue[idx].finishTime = currentTime;
            processQueue[idx].turnaroundTime = processQueue[idx].finishTime - processQueue[idx].arrivalTime;
            isCompleted[idx] = true;
            completed++;

            timeline.push({
                processId: processQueue[idx].id,
                startTime: processQueue[idx].startTime,
                endTime: processQueue[idx].finishTime
            });
        } else {
            currentTime++;
        }
    }
    return { timeline, processes: processQueue };
}
