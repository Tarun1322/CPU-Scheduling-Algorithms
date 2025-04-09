export function calculateRR(processes, timeQuantum) {
    const processQueue = JSON.parse(JSON.stringify(processes));
    let currentTime = 0;
    let completed = 0;
    const n = processQueue.length;
    const timeline = [];
    let queue = [];

    // Initialize remaining time for all processes
    processQueue.forEach(p => {
        p.remainingTime = p.burstTime;
    });

    while (completed < n) {
        // Add newly arrived processes to queue
        processQueue.forEach(p => {
            if (p.arrivalTime <= currentTime && p.remainingTime > 0 && !queue.includes(p)) {
                queue.push(p);
            }
        });

        // If queue is empty, advance time and add idle block
        if (queue.length === 0) {
            let nextArrival = Math.min(...processQueue
                .filter(p => p.remainingTime > 0)
                .map(p => p.arrivalTime));
            
            if (nextArrival > currentTime) {
                timeline.push({
                    processId: 'idle',
                    startTime: currentTime,
                    endTime: nextArrival
                });
                currentTime = nextArrival;
            } else {
                currentTime++;
            }
            continue;
        }

        // Get next process from queue
        let currentProcess = queue.shift();
        
        // Record response time if first time running
        if (currentProcess.startTime === -1) {
            currentProcess.startTime = currentTime;
            currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
        }

        // Calculate execution time for this quantum
        let executionTime = Math.min(timeQuantum, currentProcess.remainingTime);
        
        // Add timeline entry
        timeline.push({
            processId: currentProcess.id,
            startTime: currentTime,
            endTime: currentTime + executionTime
        });

        // Update process state
        currentProcess.remainingTime -= executionTime;
        currentTime += executionTime;

        // Check if process is completed
        if (currentProcess.remainingTime === 0) {
            completed++;
            currentProcess.finishTime = currentTime;
            currentProcess.turnaroundTime = currentProcess.finishTime - currentProcess.arrivalTime;
            currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
        } else {
            // Add newly arrived processes before re-adding current process
            processQueue.forEach(p => {
                if (p.arrivalTime <= currentTime && p.remainingTime > 0 && 
                    !queue.includes(p) && p !== currentProcess) {
                    queue.push(p);
                }
            });
            // Re-add current process to end of queue
            queue.push(currentProcess);
        }
    }

    return { timeline, processes: processQueue };
}