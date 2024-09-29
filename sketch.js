let algorithms = ["FCFS", "SJF", "Priority", "Round Robin"];
let selectedAlgorithm = 'FCFS';
let processes = [];
let totalProcesses = 4; // Default number of processes
let currentTime = 0;
let completedProcesses = 0;
let isRunning = false;
let timeSlice = 3; // Default Time slice for Round Robin
let ganttChart = [];
let interval;

let algorithmSelect;
let processInputDiv;
let startButton;
let resetButton;
let presetButton;
let processInputs = [];

function setup() {
    let cnv = createCanvas(1000, 400);
    cnv.position((windowWidth - width) / 2, (windowHeight)/2); // Center it

    // Create UI Elements
    createUI();

    // Initialize with default number of processes
    createProcessInputs(totalProcesses);
}

function draw() {
    background(220);
    drawProcesses();
    drawGanttChart();

    if (isRunning) {
        switch (selectedAlgorithm) {
            case 'FCFS':
                fcfsSchedulingVisualization();
                break;
            case 'SJF':
                sjfSchedulingVisualization();
                break;
            case 'Priority':
                prioritySchedulingVisualization();
                break;
            case 'Round Robin':
                roundRobinSchedulingVisualization();
                break;
        }
    }
}

function createUI() {
    // Algorithm Selection
    createP("Select Scheduling Algorithm:").position(820, 10);
    algorithmSelect = createSelect();
    for (let algo of algorithms) {
        algorithmSelect.option(algo);
    }
    algorithmSelect.selected(selectedAlgorithm);
    algorithmSelect.position(820, 40);
    algorithmSelect.changed(() => {
        selectedAlgorithm = algorithmSelect.value();
        if (selectedAlgorithm !== 'Round Robin') {
            // Hide time slice input if not Round Robin
            timeSliceInput.hide();
            timeSliceLabel.hide();
        } else {
            timeSliceInput.show();
            timeSliceLabel.show();
        }

        // If Priority Scheduling, show priority inputs
        updateProcessInputs();
    });

    // Time Slice for Round Robin
    timeSliceLabel = createP("Time Slice:");
    timeSliceLabel.position(820, 70);
    timeSliceInput = createInput(timeSlice.toString());
    timeSliceInput.position(820, 100);
    if (selectedAlgorithm !== 'Round Robin') {
        timeSliceInput.hide();
        timeSliceLabel.hide();
    }

    // Number of Processes
    createP("Number of Processes:").position(820, 130);
    let numProcessesInput = createInput(totalProcesses.toString());
    numProcessesInput.position(820, 160);
    let setProcessesButton = createButton("Set Processes");
    setProcessesButton.position(820, 190);
    setProcessesButton.mousePressed(() => {
        let n = int(numProcessesInput.value());
        if (n > 0 && n <= 10) { // Limit to 10 for UI purposes
            totalProcesses = n;
            createProcessInputs(totalProcesses);
        } else {
            alert("Please enter a number between 1 and 10.");
        }
    });

    // Preset Button for Arrival Time = 0 and Identical Burst Time
    presetButton = createButton("Preset: Arrival=0, Same Burst");
    presetButton.position(820, 220);
    presetButton.mousePressed(() => {
        presetProcesses(totalProcesses);
    });

    // Process Inputs Container
    processInputDiv = createDiv('');
    processInputDiv.position(820, 250);

    // Start and Reset Buttons
    startButton = createButton("Start Simulation");
    startButton.position(820, 500);
    startButton.mousePressed(startSimulation);

    resetButton = createButton("Reset");
    resetButton.position(920, 500);
    resetButton.mousePressed(resetSimulation);
}

function createProcessInputs(n) {
    // Clear previous inputs
    processInputDiv.html('');
    processInputs = [];

    for (let i = 0; i < n; i++) {
        let pDiv = createDiv(`Process ${i + 1}: `);
        pDiv.parent(processInputDiv);

        createSpan("Arrival Time: ").parent(pDiv);
        let arrivalInput = createInput("0");
        arrivalInput.size(40);
        arrivalInput.parent(pDiv);

        createSpan(" Burst Time: ").parent(pDiv);
        let burstInput = createInput("5");
        burstInput.size(40);
        burstInput.parent(pDiv);

        if (selectedAlgorithm === 'Priority') {
            createSpan(" Priority: ").parent(pDiv);
            let priorityInput = createInput("1");
            priorityInput.size(40);
            priorityInput.parent(pDiv);
            processInputs.push({ arrival: arrivalInput, burst: burstInput, priority: priorityInput });
        } else {
            processInputs.push({ arrival: arrivalInput, burst: burstInput });
        }

        pDiv.child(createSpan("<br/>")); // New line
    }
}

function updateProcessInputs() {
    // Update existing process inputs to show/hide priority based on selected algorithm
    for (let i = 0; i < processInputs.length; i++) {
        let pInputs = processInputs[i];
        if (selectedAlgorithm === 'Priority') {
            if (!pInputs.priority) {
                let pDiv = processInputDiv.child(i).child(processInputDiv.child(i).child.length - 1);
                createSpan(" Priority: ").parent(pDiv);
                let priorityInput = createInput("1");
                priorityInput.size(40);
                priorityInput.parent(pDiv);
                pInputs.priority = priorityInput;
            }
        } else {
            if (pInputs.priority) {
                pInputs.priority.parent().remove();
                pInputs.priority = null;
            }
        }
    }
}

function presetProcesses(n) {
    for (let i = 0; i < n; i++) {
        processInputs[i].arrival.value("0");
        processInputs[i].burst.value("5"); // You can set any identical burst time here
        if (selectedAlgorithm === 'Priority') {
            processInputs[i].priority.value("1"); // Same priority
        }
    }
    alert("Preset applied: All Arrival Times = 0 and Burst Times = 5 (Priority = 1 if applicable)");
}

function startSimulation() {
    // Initialize Processes
    processes = [];
    ganttChart = [];
    currentTime = 0;
    completedProcesses = 0;
    rrQueue = [];
    rrCurrentProcess = null;
    rrTimeCounter = 0;

    for (let i = 0; i < totalProcesses; i++) {
        let arrivalTime = int(processInputs[i].arrival.value());
        let burstTime = int(processInputs[i].burst.value());
        let priority = selectedAlgorithm === 'Priority' ? int(processInputs[i].priority.value()) : 0;
        processes.push({
            id: i + 1,
            arrivalTime,
            burstTime,
            remainingTime: burstTime,
            completed: false,
            priority,
            startTime: null,
            completionTime: null
        });
    }

    if (selectedAlgorithm === 'Round Robin') {
        timeSlice = int(timeSliceInput.value());
        if (isNaN(timeSlice) || timeSlice <= 0) {
            alert("Please enter a valid Time Slice for Round Robin.");
            return;
        }
    }

    isRunning = true;
    startButton.attribute('disabled', '');
    resetButton.removeAttribute('disabled');
    loop();
}

function resetSimulation() {
    isRunning = false;
    processes = [];
    ganttChart = [];
    currentTime = 0;
    completedProcesses = 0;
    rrQueue = [];
    rrCurrentProcess = null;
    rrTimeCounter = 0;
    selectedAlgorithm = algorithmSelect.value();

    if (selectedAlgorithm !== 'Round Robin') {
        timeSliceInput.hide();
        timeSliceLabel.hide();
    } else {
        timeSliceInput.show();
        timeSliceLabel.show();
    }

    loop();
}

//////////////////////
// Scheduling Algorithms
//////////////////////

// First-Come, First-Served Scheduling
function fcfsSchedulingVisualization() {
    if (completedProcesses >= totalProcesses) {
        isRunning = false;
        fill(0);
        textAlign(CENTER);
        textSize(20);
        text("All Processes Completed (FCFS)", width / 2, height - 50);
        return;
    }

    let process = getNextProcessFCFS();
    if (process) {
        if (process.startTime === null) {
            process.startTime = currentTime;
        }
        process.remainingTime--;
        if (process.remainingTime === 0) {
            process.completed = true;
            process.completionTime = currentTime + 1;
            completedProcesses++;
        }
        ganttChart.push({ time: currentTime, processId: process.id });
        currentTime++;
    } else {
        // Idle time
        ganttChart.push({ time: currentTime, processId: 'Idle' });
        currentTime++;
    }

    // Slow down the simulation
    noLoop();
    setTimeout(() => {
        loop();
    }, 500);
}

function getNextProcessFCFS() {
    let readyQueue = processes.filter(p => p.arrivalTime <= currentTime && !p.completed && p.remainingTime > 0);
    if (readyQueue.length > 0) {
        // Sort by arrival time, then by process ID
        readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id);
        return readyQueue[0];
    }
    return null;
}

// Shortest Job First Scheduling
function sjfSchedulingVisualization() {
    if (completedProcesses >= totalProcesses) {
        isRunning = false;
        fill(0);
        textAlign(CENTER);
        textSize(20);
        text("All Processes Completed (SJF)", width / 2, height - 50);
        return;
    }

    let process = getNextProcessSJF();
    if (process) {
        if (process.startTime === null) {
            process.startTime = currentTime;
        }
        process.remainingTime--;
        if (process.remainingTime === 0) {
            process.completed = true;
            process.completionTime = currentTime + 1;
            completedProcesses++;
        }
        ganttChart.push({ time: currentTime, processId: process.id });
        currentTime++;
    } else {
        // Idle time
        ganttChart.push({ time: currentTime, processId: 'Idle' });
        currentTime++;
    }

    // Slow down the simulation
    noLoop();
    setTimeout(() => {
        loop();
    }, 500);
}

function getNextProcessSJF() {
    let readyQueue = processes.filter(p => p.arrivalTime <= currentTime && !p.completed && p.remainingTime > 0);
    if (readyQueue.length > 0) {
        // Shortest Remaining Time First
        readyQueue.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime);
        return readyQueue[0];
    }
    return null;
}

// Priority Scheduling
function prioritySchedulingVisualization() {
    if (completedProcesses >= totalProcesses) {
        isRunning = false;
        fill(0);
        textAlign(CENTER);
        textSize(20);
        text("All Processes Completed (Priority)", width / 2, height - 50);
        return;
    }

    let process = getNextProcessPriority();
    if (process) {
        if (process.startTime === null) {
            process.startTime = currentTime;
        }
        process.remainingTime--;
        if (process.remainingTime === 0) {
            process.completed = true;
            process.completionTime = currentTime + 1;
            completedProcesses++;
        }
        ganttChart.push({ time: currentTime, processId: process.id });
        currentTime++;
    } else {
        // Idle time
        ganttChart.push({ time: currentTime, processId: 'Idle' });
        currentTime++;
    }

    // Slow down the simulation
    noLoop();
    setTimeout(() => {
        loop();
    }, 500);
}

function getNextProcessPriority() {
    let readyQueue = processes.filter(p => p.arrivalTime <= currentTime && !p.completed && p.remainingTime > 0);
    if (readyQueue.length > 0) {
        // Higher priority first (lower number)
        readyQueue.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
        return readyQueue[0];
    }
    return null;
}

// Round Robin Scheduling
let rrQueue = [];
let rrCurrentProcess = null;
let rrTimeCounter = 0;

function roundRobinSchedulingVisualization() {
    if (completedProcesses >= totalProcesses) {
        isRunning = false;
        fill(0);
        textAlign(CENTER);
        textSize(20);
        text("All Processes Completed (Round Robin)", width / 2, height - 50);
        return;
    }

    if (rrCurrentProcess === null || rrTimeCounter === timeSlice || rrCurrentProcess.completed) {
        if (rrCurrentProcess && !rrCurrentProcess.completed) {
            rrQueue.push(rrCurrentProcess);
        }
        rrCurrentProcess = getNextProcessRR();
        rrTimeCounter = 0;
    }

    if (rrCurrentProcess) {
        if (rrCurrentProcess.startTime === null) {
            rrCurrentProcess.startTime = currentTime;
        }
        rrCurrentProcess.remainingTime--;
        rrTimeCounter++;
        if (rrCurrentProcess.remainingTime === 0) {
            rrCurrentProcess.completed = true;
            rrCurrentProcess.completionTime = currentTime + 1;
            completedProcesses++;
            rrCurrentProcess = null;
        }
        ganttChart.push({ time: currentTime, processId: rrCurrentProcess.id });
        currentTime++;
    } else {
        // Idle time
        ganttChart.push({ time: currentTime, processId: 'Idle' });
        currentTime++;
    }

    // Slow down the simulation
    noLoop();
    setTimeout(() => {
        loop();
    }, 500);
}

function getNextProcessRR() {
    // Add newly arrived processes to the queue
    for (let p of processes) {
        if (p.arrivalTime === currentTime && !p.completed && !rrQueue.includes(p) && p !== rrCurrentProcess) {
            rrQueue.push(p);
        }
    }

    if (rrQueue.length > 0) {
        return rrQueue.shift();
    }

    // Check if any process has arrived
    let readyQueue = processes.filter(p => p.arrivalTime <= currentTime && !p.completed && p.remainingTime > 0);
    if (readyQueue.length > 0) {
        // Sort by arrival time
        readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
        return readyQueue[0];
    }

    return null;
}

///////////////////////////
// Drawing Functions
///////////////////////////

function drawProcesses() {
    fill(0);
    textSize(16);
    textAlign(LEFT);
    text("Processes:", 20, 20);

    // Table Headers
    text("ID", 20, 40);
    text("Arrival", 60, 40);
    text("Burst", 120, 40);
    if (selectedAlgorithm === 'Priority') {
        text("Priority", 180, 40);
    }
    text("Remaining", selectedAlgorithm === 'Priority' ? 260 : 180, 40);

    for (let i = 0; i < processes.length; i++) {
        let process = processes[i];
        text(process.id, 20, 60 + i * 20);
        text(process.arrivalTime, 60, 60 + i * 20);
        text(process.burstTime, 120, 60 + i * 20);
        if (selectedAlgorithm === 'Priority') {
            text(process.priority, 180, 60 + i * 20);
        }
        text(process.remainingTime, selectedAlgorithm === 'Priority' ? 260 : 180, 60 + i * 20);
    }
}

function drawGanttChart() {
    fill(0);
    textSize(16);
    textAlign(LEFT);
    text("Gantt Chart:", 20, 200);

    // Draw Gantt Chart Blocks
    let startX = 20;
    let blockHeight = 40;
    let blockWidth = 30;

    for (let i = 0; i < ganttChart.length; i++) {
        let ganttItem = ganttChart[i];
        let x = startX + i * blockWidth;
        fill(ganttItem.processId === 'Idle' ? [150, 150, 150] : [100, 200, 255]);
        rect(x, 220, blockWidth, blockHeight);
        fill(0);
        textAlign(CENTER, CENTER);
        text(ganttItem.processId, x + blockWidth / 2, 220 + blockHeight / 2);
    }

    // Time Labels
    fill(0);
    textAlign(LEFT, TOP);
    for (let i = 0; i < ganttChart.length; i++) {
        let x = startX + i * blockWidth;
        text(i, x, 220 + blockHeight + 5);
    }
    // Last Time Label
    text(ganttChart.length, startX + ganttChart.length * blockWidth, 220 + blockHeight + 5);

    // Current Algorithm Display
    textSize(16);
    textAlign(LEFT, TOP);
    text("Current Algorithm: " + selectedAlgorithm, 20, 180);
}

///////////////////////////
// Additional Features
///////////////////////////

// Optionally, you can add more features like calculating waiting time, turnaround time, etc.
