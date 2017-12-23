// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let base = 0;

let outString = "";

let printedTree = ["# \n"];

// function uuidv4() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }


// function printTree(root) {
//     printTreeHelp(root, 1);
// }

// function printTreeHelp(curr, line) {
//     if (curr === null) {
//         return;
//     }
//     if (printedTree.length <= line) {
//         printedTree = printedTree.concat(["# \n"]);
//         printedTree = printedTree.concat(["# \n"]);
//     }
//     printTreeHelp(curr.left, line + 2);
//     printTreeHelp(curr.right, line + 2);
// }

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function buildBinSearchTree(dataArr) {
    var mid = Math.floor(dataArr.length / 2);
    var nodeName = "node" + base;
    base += 1;
    outString += nodeName + " = BTNode(" + dataArr[mid] + ")\n";
    if (dataArr.length === 1) {
        return nodeName;
    }
    var left = nodeName + ".left = " + buildBinSearchTree(dataArr.slice(0, mid)) + "\n";
    outString += left;
    if (dataArr.length === 2) {
        return nodeName;
    }
    var right = nodeName + ".right = " + buildBinSearchTree(dataArr.slice(mid + 1, dataArr.length))  + "\n";
    outString += right;
    return nodeName;
}

function genTree(numNodes, minimum, maximum, genClass, isBinSearch) {
    const editor = vscode.window.activeTextEditor;

    if (editor) {

        let mData = new Array(numNodes);
        let interval = Math.floor((maximum - minimum) / numNodes);
        let data = Math.abs(minimum);
        for (var i = 0; i < numNodes; i++) {
            mData[i] = randomIntFromInterval(data + i * interval, data + (i + 1) * interval);
        }

        if (!isBinSearch) {
            shuffleArray(mData);
        }

        if (genClass === "y" || genClass === "yes") {
            var nodeStr = "class BTNode:\n\tdef __init__(self, data):\n\t\tself.data = data\n\t\tself.right = None\n\t\tself.left = None\n\n";
            outString += nodeStr;
        }
        var root = buildBinSearchTree(mData);

        // DEBUG
        // for (var line in printedTree) {
        //     outString += line;
        // }

        outString += "\n# This is the root of the tree\n";
        outString += "treeRoot" + root + " = " + root + "\n\n";

        const cursorPos = editor.selection.active;
        editor.edit((tee) => {
            tee.insert(cursorPos, outString);
        });
        outString = "";
    }
}

function genLL(numNodes, numNodesInCycle, minimum, maximum, sorted, genLLNodeClass) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        if (genLLNodeClass) {
            var nodeStr = "class LLNode:\ndef __init__(self, data):\n\t\tself.data = data\n\t\tself.next = None\n\n";
            outString += nodeStr;
        }

        let mData = new Array(numNodes);
        let interval = Math.floor((maximum - minimum) / numNodes);
        let data = Math.abs(minimum);
        for (var i = 0; i < numNodes; i++) {
            mData[i] = randomIntFromInterval(data + i * interval, data + (i + 1) * interval);
        }

        if (sorted !== "y" && sorted !== "yes") {
            shuffleArray(mData);
        }

        let mNodes = new Array(numNodes);
        var cycleStart = "";
        for (i = 0; i < numNodes; i++) {
            var nodeName = "node" + base++;
            mNodes[i] = nodeName;
            if (numNodes - numNodesInCycle == i)
                cycleStart = nodeName;
            outString += nodeName + " = LLNode(" + mData[i] + ")\n";
        }

        for (i = 0; i < numNodes - 1; i++) {
            outString += mNodes[i] + ".next = " + mNodes[i + 1] + "\n";
        }

        if (numNodesInCycle != 0) {
            outString += mNodes[numNodes - 1] + ".next = " + cycleStart + "\n";
        }
        
        outString += "\n# This is the head of the linked list\n";
        outString += "llHead" + mNodes[0] + " = " + mNodes[0] + "\n\n";

        const cursorPos = editor.selection.active;
        editor.edit((tee) => {
            tee.insert(cursorPos, outString);
        });
        outString = "";
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "quickdatastructures" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let binSearchTree = vscode.commands.registerCommand('extension.genBinSearchTree', function () {
        vscode.window.showInputBox({value: "10", prompt: 'Enter number of nodes in the tree'}).then((numNodes) => {
            vscode.window.showInputBox({value: "0", prompt: 'Enter minimum data value (integer)'}).then((minimum) => {
                vscode.window.showInputBox({value: numNodes * 100, prompt: 'Enter maximum data value (integer)'}).then((maximum) => {
                    vscode.window.showInputBox({prompt: 'Generate BinTree Node class? (y/n)'}).then((genClass) => {
                        genTree(numNodes, minimum, maximum, genClass, true);
                    }, (error) => {
                        console.log(error);
                    });
                }, (error) => {
                    console.log(error);
                });
            }, (error) => {
                console.log(error);
            });
        }, (error) => {
            console.log(error);
        });
    });

    let binTree = vscode.commands.registerCommand('extension.genBinTree', function () {
        vscode.window.showInputBox({value: "10", prompt: 'Enter number of nodes in the tree'}).then((numNodes) => {
            vscode.window.showInputBox({value: "0", prompt: 'Enter minimum data value (integer)'}).then((minimum) => {
                vscode.window.showInputBox({value: numNodes * 100, prompt: 'Enter maximum data value (integer)'}).then((maximum) => {
                    vscode.window.showInputBox({prompt: 'Generate BinTree Node class? (y/n)'}).then((genClass) => {
                        genTree(numNodes, minimum, maximum, genClass, false);
                    }, (error) => {
                        console.log(error);
                    });
                }, (error) => {
                    console.log(error);
                });
            }, (error) => {
                console.log(error);
            });
        }, (error) => {
            console.log(error);
        });
    });

    let linkedList = vscode.commands.registerCommand('extension.genLL', function () {
        vscode.window.showInputBox({value: "10", prompt: 'Enter number of nodes in the list'}).then((numNodes) => {
            vscode.window.showInputBox({value: "0", prompt: 'Enter minimum data value (integer)'}).then((minimum) => {
                vscode.window.showInputBox({value: numNodes * 100, prompt: 'Enter maximum data value (integer)'}).then((maximum) => {
                    vscode.window.showInputBox({value: "0", prompt: 'Enter number of nodes in a cycle (integer [0-N], N = total nodes in list)'}).then((cycleNodes) => {
                        if (Math.abs(cycleNodes) > Math.abs(numNodes)) {
                            console.log("Error - not enough nodes in LL");
                            return;
                        }
                        vscode.window.showInputBox({prompt: 'Should the list be sorted? (y/n) - default is yes'}).then((sorted) => {
                            vscode.window.showInputBox({prompt: 'Generate LL Node class? (y/n) - default is no'}).then((genClass) => {
                                if (genClass === "y" || genClass === "yes") {
                                    genLL(numNodes, cycleNodes, minimum, maximum, sorted, true);
                                } else {
                                    genLL(numNodes, cycleNodes, minimum, maximum, sorted, false);
                                }
                            }, (error) => {
                                console.log(error);
                            });
                        }, (error) => {
                            console.log(error);
                        });
                    }, (error) => {
                        console.log(error);
                    });
                }, (error) => {
                    console.log(error);
                });
            }, (error) => {
                console.log(error);
            });
        }, (error) => {
            console.log(error);
        });
    });

    context.subscriptions.push(binSearchTree);
    context.subscriptions.push(binTree);
    context.subscriptions.push(linkedList);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;