export function calculatePriorityNP(processes) {
    const processQueue = JSON.parse(JSON.stringify(processes));
    let currentTime = 0;
    let completed = 0;
    const n = processQueue.length;
    const isCompleted = Array(n).fill(false);
    const timeline = [];

    while (completed < n) {
        let idx = -1;
        let highestPriority = Infinity;

        processQueue.forEach((process, i) => {
            if (process.arrivalTime <= currentTime && !isCompleted[i]) {
                if (process.priority < highestPriority) {
                    highestPriority = process.priority;
                    idx = i;
                } else if (process.priority === highestPriority) {
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

export function calculatePriorityP(processes) {
    const processQueue = JSON.parse(JSON.stringify(processes));
    let currentTime = 0;
    let completed = 0;
    const n = processQueue.length;
    const timeline = [];
    let currentProcess = null;

    while (completed < n) {
        let availableProcesses = processQueue.filter(p => 
            p.remainingTime > 0 && p.arrivalTime <= currentTime
        );

        if (availableProcesses.length === 0) {
            if (currentProcess) {
                timeline.push({
                    processId: currentProcess.id,
                    startTime: currentProcess.startTime,
                    endTime: currentTime
                });
                currentProcess = null;
            }
            currentTime++;
            continue;
        }

        let highestPriority = availableProcesses.reduce((prev, curr) => 
            prev.priority < curr.priority ? prev : curr
        );

        if (highestPriority.startTime === -1) {
            highestPriority.startTime = currentTime;
            highestPriority.responseTime = currentTime - highestPriority.arrivalTime;
        }

        if (currentProcess && currentProcess.priority > highestPriority.priority) {
            timeline.push({
                processId: currentProcess.id,
                startTime: currentProcess.startTime,
                endTime: currentTime
            });
            highestPriority.startTime = currentTime;
            currentProcess = highestPriority;
        }

        currentProcess = highestPriority;
        currentProcess.remainingTime--;
        currentTime++;

        if (currentProcess.remainingTime === 0) {
            currentProcess.finishTime = currentTime;
            currentProcess.turnaroundTime = currentProcess.finishTime - currentProcess.arrivalTime;
            currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
            completed++;
            timeline.push({
                processId: currentProcess.id,
                startTime: currentProcess.startTime,
                endTime: currentTime
            });
            currentProcess = null;
        }
    }

    return { timeline, processes: processQueue };
}
