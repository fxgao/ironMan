let eslint = require('eslint')
let Linter = eslint.Linter

function checkCode(code){
    let codeText = code.CodeText;
    let linter = new Linter();
    let messages = linter.verifyAndFix(codeText,{
        "env": {
            "browser": true,
            "commonjs": true,
            "es6": true
        },
        "extends": "eslint:recommended",
        "parserOptions": {
            "sourceType": "module"
        },
        "rules": {
            "indent": [
                "error",
                "tab"
            ],
            "linebreak-style": [
                "error",
                "windows"
            ],
            "quotes": [
                "error",
                "double"
            ],
            "semi": [
                "error",
                "always"
            ]
        }
    })
    return messages
}

exports.verifyAndFix = function(req,res,next){
    let code = req.body;
    let message = checkCode(code)
    res.send(message)
}
