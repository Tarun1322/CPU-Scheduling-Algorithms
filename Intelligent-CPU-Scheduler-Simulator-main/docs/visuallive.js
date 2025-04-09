let simulationState = {
    isRunning: false,
    isPaused: false,
    currentStep: 0,
    timelineSteps: [],
    metricsState: null,
    timeoutId: null
};

export function initializeVisualization(result) {
    resetSimulation();
    
    // Deep clone processes and timeline
    simulationState.metricsState = {
        processes: JSON.parse(JSON.stringify(result.processes)),
        timeline: JSON.parse(JSON.stringify(result.timeline))
    };

    // Build timeline steps
    simulationState.timelineSteps = [];
    simulationState.metricsState.timeline.forEach(block => {
        for(let t = block.startTime; t < block.endTime; t++) {
            simulationState.timelineSteps.push({
                time: t,
                processId: block.processId,
                isIdle: block.processId === 'idle'
            });
        }
    });

    // Fill idle gaps
    const maxTime = Math.max(...simulationState.timelineSteps.map(t => t.time), 0);
    for(let t = 0; t <= maxTime; t++) {
        if(!simulationState.timelineSteps.some(step => step.time === t)) {
            simulationState.timelineSteps.push({ 
                time: t, 
                processId: 'idle', 
                isIdle: true 
            });
        }
    }

    simulationState.timelineSteps.sort((a, b) => a.time - b.time);
}

function simulationStep() {
    if (!simulationState.isRunning || simulationState.currentStep >= simulationState.timelineSteps.length) {
        stopSimulation();
        return;
    }

    if (simulationState.isPaused) {
        clearTimeout(simulationState.timeoutId);
        return;
    }

    const step = simulationState.timelineSteps[simulationState.currentStep];
    
    updateLiveGantt(step);
    updateLiveMetrics();
    
    simulationState.currentStep++;
    simulationState.timeoutId = setTimeout(simulationStep, 1000);
}

// Modify the startLiveVisualization function
export function startLiveVisualization(result) {
    if (simulationState.isRunning) return;
    
    // Clear previous simulation properly
    document.getElementById('ganttChartLive').innerHTML = '';
    document.getElementById('liveMetrics').style.display = 'block';
    
    // Initialize fresh state
    simulationState = {
        isRunning: true,
        isPaused: false,
        currentStep: 0,
        timelineSteps: [],
        metricsState: {
            processes: JSON.parse(JSON.stringify(result.processes)),
            timeline: JSON.parse(JSON.stringify(result.timeline))
        },
        timeoutId: null
    };

    // Build timeline steps (FIXED VERSION)
    simulationState.metricsState.timeline.forEach(block => {
        for(let t = block.startTime; t < block.endTime; t++) {
            simulationState.timelineSteps.push({
                time: t,
                processId: block.processId,
                isIdle: block.processId === 'idle'
            });
        }
    });

    // Start simulation
    simulationStep();
}

export function togglePause() {
    if (!simulationState.isRunning) return;
    simulationState.isPaused = !simulationState.isPaused;
    document.getElementById('pauseBtn').textContent = simulationState.isPaused ? '▶ Resume' : '⏸ Pause';
    
    if (!simulationState.isPaused && simulationState.isRunning) {
        // Resume the simulation if it was running
        simulationStep();
    }
}

export function stopSimulation() {
    simulationState.isRunning = false;
    clearTimeout(simulationState.timeoutId);
}

export function resetSimulation() {
    stopSimulation();
    simulationState.isPaused = false;
    simulationState.currentStep = 0;
    simulationState.timelineSteps = [];
    simulationState.metricsState = null;
    document.getElementById('ganttChartLive').innerHTML = '';
    document.getElementById('liveMetrics').style.display = 'none';
}

function updateLiveMetrics() {
    const completedProcesses = simulationState.metricsState?.processes?.filter(p => 
        p.finishTime <= simulationState.timelineSteps[simulationState.currentStep]?.time && 
        p.turnaroundTime >= 0
    ) || [];

    // Match final calculation exactly
    const validProcesses = completedProcesses.filter(p => 
        Number.isFinite(p.turnaroundTime) && 
        Number.isFinite(p.waitingTime)
    );

    const avgTurnaround = validProcesses.length > 0 ?
        (validProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0) / validProcesses.length).toFixed(2) : '0.00';
    
    const avgWaiting = validProcesses.length > 0 ?
        (validProcesses.reduce((sum, p) => sum + p.waitingTime, 0) / validProcesses.length).toFixed(2) : '0.00';

    document.getElementById('currentTime').textContent = simulationState.timelineSteps[simulationState.currentStep]?.time || 0;
    // document.getElementById('avgTurnaroundLive').textContent = avgTurnaround;
    // document.getElementById('avgWaitingLive').textContent = avgWaiting;
}

function updateLiveGantt(step) {
    const ganttChart = document.getElementById('ganttChartLive');
    const block = document.createElement('div');
    
    block.className = `gantt-block-live ${step.isIdle ? 'idle' : ''}`;
    block.textContent = step.isIdle ? 'Idle' : `P${step.processId}`;
    
    if(!step.isIdle) {
        block.style.backgroundColor = `hsl(${(step.processId * 137.5) % 360}, 70%, 70%)`;
    }
    
    ganttChart.appendChild(block);
    ganttChart.scrollLeft = ganttChart.scrollWidth;
    
    // Update current time display
    document.getElementById('currentTime').textContent = step.time;
}