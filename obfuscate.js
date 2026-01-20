const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// 目标JS文件夹（uniapp H5打包后的JS目录）
// Adjusted path to match user's current structure
const jsDir = path.join(__dirname, 'static/js');

// 混淆配置（强度较高的配置）
const obfuscationOptions = {
    compact: true, // 压缩代码
    controlFlowFlattening: true, // 开启控制流平坦化（大幅增加阅读难度）
    controlFlowFlatteningThreshold: 0.8, // 控制流平坦化比例
    stringArray: true, // 启用字符串数组加密
    stringArrayEncoding: ['base64'], // 字符串编码方式
    stringArrayThreshold: 0.8, // 字符串加密比例
    deadCodeInjection: true, // 注入死代码干扰分析
    deadCodeInjectionThreshold: 0.4, // 死代码注入比例
    renameGlobals: false, // 不重命名全局变量（避免第三方库报错）
    selfDefending: true, // 防止代码被格式化和篡改
    debugProtection: true, // 禁止调试
    debugProtectionInterval: 4000 // 调试保护间隔
};

// 遍历JS文件并混淆
if (fs.existsSync(jsDir)) {
    fs.readdirSync(jsDir).forEach(file => {
        if (file.endsWith('.js') && !file.includes('.min.js')) {
            const filePath = path.join(jsDir, file);
            const code = fs.readFileSync(filePath, 'utf-8');

            // 对非依赖库的业务代码做深度混淆
            if (file.includes('pages-') || file.includes('index.')) {
                try {
                    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscationOptions).getObfuscatedCode();
                    fs.writeFileSync(filePath, obfuscatedCode, 'utf-8');
                    console.log(`✅ 已混淆：${file}`);
                } catch (error) {
                    console.error(`❌ 混淆失败 ${file}:`, error);
                }
            } else {
                console.log(`⚠️  跳过依赖库：${file}`);
            }
        }
    });
    console.log('🎉 所有业务代码混淆完成！');
} else {
    console.error(`❌ 目标目录不存在：${jsDir}`);
}
