// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import * as path from 'path';
import { ESLintTSManager } from 'linter-maintainer';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const addRemove = vscode.commands.registerCommand('linter-maintainer.addRemoveESLintRules', addRemoveRules);
	context.subscriptions.push(addRemove);

	const add = vscode.commands.registerCommand('linter-maintainer.addESLintRules', addRules);
	context.subscriptions.push(add);

	const remove = vscode.commands.registerCommand('linter-maintainer.removeESLintRules', removeRules);
	context.subscriptions.push(remove);
}

// async function selectTargetPath() {
// 	const activeDocument = vscode.window.activeTextEditor?.document;
// 	if (!activeDocument) {
// 		vscode.window.showErrorMessage('No file is open');
// 		return;
// 	}
// 	const currentFileName = activeDocument.fileName;

// 	const fileDir = path.dirname(currentFileName);
// 	const workingFolder = vscode.workspace.getWorkspaceFolder(activeDocument.uri);

// 	const targetOptions = [fileDir];
// 	if (workingFolder && workingFolder.uri.fsPath !== fileDir) {
// 		targetOptions.push(workingFolder.uri.fsPath);
// 	}
// 	targetOptions.push('Define by yourself');

// 	let targetPath = await vscode.window.showQuickPick(targetOptions,
// 		{placeHolder: 'Select target folder path', canPickMany: false});

// 	if (targetPath && targetPath === 'Define by yourself') {
// 		targetPath = await vscode.window.showInputBox({placeHolder: 'Enter new path'});
// 	}

// 	return targetPath;
// }

async function addRemoveRules() {
	addRules();
	removeRules();
}

async function addRules() {
	const activeDocument = vscode.window.activeTextEditor?.document;
	if (!activeDocument) {
		vscode.window.showErrorMessage('No file is open');
		return;
	}
	const currentFilePath = activeDocument.uri.path;
	const eslintManager = new ESLintTSManager(currentFilePath);

	let FN: string[] = [];
	try {
		FN = await eslintManager.getFalseNegative();
	} catch(e) {
		console.log(e);
		vscode.window.showErrorMessage('Failed to add rules');
		return;
	}
	if (FN.length === 0) {
		vscode.window.showInformationMessage('No rules to add');
		return;
	}
	const newConfig = eslintManager.enableRules(FN, currentFilePath);

	try {
		fs.writeFileSync(currentFilePath, newConfig);
	} catch {
		vscode.window.showErrorMessage('Failed to write new config');
		return;
	}

	vscode.window.showInformationMessage(`Added ${FN.length} rules`);
}

async function removeRules() {
	const activeDocument = vscode.window.activeTextEditor?.document;
	if (!activeDocument) {
		vscode.window.showErrorMessage('No file is open');
		return;
	}
	const currentFilePath = activeDocument.uri.path;
	const eslintManager = new ESLintTSManager(currentFilePath);

	let FP: string[] = [];
	try {
		FP = await eslintManager.getFalsePositive();
		if (FP.length === 0) {
			vscode.window.showInformationMessage('No rules to remove');
			return;
		}
	} catch(e) {
		console.log(e);
		vscode.window.showErrorMessage('Failed to remove rules');
		return;
	}

	const newConfig = eslintManager.disableRules(FP, currentFilePath);

	console.log(newConfig);
	try {
		fs.writeFileSync(currentFilePath, newConfig);
	} catch {
		vscode.window.showErrorMessage('Failed to write new config');
		return;
	}

	vscode.window.showInformationMessage(`Removed ${FP.length} rules`);
}



// this method is called when your extension is deactivated
export function deactivate() {}
