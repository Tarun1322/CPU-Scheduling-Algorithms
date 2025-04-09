export function calculateSRTF(processes) {
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

        let shortestJob = availableProcesses.reduce((prev, curr) => 
            prev.remainingTime < curr.remainingTime ? prev : curr
        );

        if (shortestJob.startTime === -1) {
            shortestJob.startTime = currentTime;
            shortestJob.responseTime = currentTime - shortestJob.arrivalTime;
        }

        if (currentProcess && currentProcess.id !== shortestJob.id) {
            timeline.push({
                processId: currentProcess.id,
                startTime: currentProcess.startTime,
                endTime: currentTime
            });
            shortestJob.startTime = currentTime;
        }

        currentProcess = shortestJob;
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
