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

function genTree(isBinSearch) {
    vscode.window.showInputBox({prompt: 'Enter number of nodes in the tree'}).then((numNodes) => {
        vscode.window.showInputBox({prompt: 'Enter minimum data value (integer)'}).then((minimum) => {
            vscode.window.showInputBox({prompt: 'Enter maximum data value (integer)'}).then((maximum) => {
                vscode.window.showInputBox({prompt: 'Generate Node class? y/n'}).then((genNode) => {

                    const editor = vscode.window.activeTextEditor;

                    if (editor) {
                        let myData = new Array(numNodes);
                        let interval = Math.floor((maximum - minimum) / numNodes);
                        let data = Math.abs(minimum);
                        for (var i = 0; i < numNodes; i++) {
                            myData[i] = randomIntFromInterval(data + i * interval, (i + 1) * interval);
                            data = myData[i];
                        }

                        if (!isBinSearch) {
                            shuffleArray(myData);
                        }

                        if (genNode === "y" || genNode === "yes") {
                            var nodeStr = "class BTNode:\n\tdef __init__(self, data):\n\t\tself.data = data\n\t\tself.right = None\n\t\tself.left = None\n\n";
                            outString += nodeStr;
                        }
                        var root = buildBinSearchTree(myData);
                        // for (var line in printedTree) {
                        //     outString += line;
                        // }

                        outString += "\ntreeroot" + root + " = " + root + "\n\n";

                        const cursorPos = editor.selection.active;
                        editor.edit((tee) => {
                            tee.insert(cursorPos, outString);
                        });
                        outString = "";
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
    let binSearch = vscode.commands.registerCommand('extension.genBinSearchTree', function () {
        genTree(true);
    });

    // let nodeObj = vscode.commands.registerCommand('extension.genNodeObject', function () {
    //     const editor = vscode.window.activeTextEditor;

    //     var nodeStr = "class Node:\n\tdef __init__(data):\n\t\tself.data = data\n\t\tself.right = None\n\t\tself.left = None"

    //     editor.edit((tee) => {
    //         tee.insert(new vscode.Position(1, 0), nodeStr);
    //     });
    // });

    let binTree = vscode.commands.registerCommand('extension.genBinTree', function () {
        genTree(false);
    });

    let linkedList = vscode.commands.registerCommand('extension.genLL', function () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {

            var nodeStr = "class LLNode:\n\tdef __init__(self, data):\n\t\tself.data = data\n\t\tself.next = None\n\n";
            outString += nodeStr;

            const cursorPos = editor.selection.active;
            editor.edit((tee) => {
                tee.insert(cursorPos, outString);
            });
            outString = "";
        }
    });

    context.subscriptions.push(binSearch);
    context.subscriptions.push(binTree);
    context.subscriptions.push(linkedList);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;