var blockly_lang = current_lang();

// only this languages are supported
console.log(blockly_lang)
if (blockly_lang.indexOf("zh") == 0) {
	blockly_lang = "zh-hans"
} else {
	blockly_lang = "en"
}

console.log("loading blockly language pack", blockly_lang);
document.write('<script src="/assets/blockly/' + blockly_lang + '.js"></script>\n');
