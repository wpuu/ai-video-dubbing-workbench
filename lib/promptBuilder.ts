import { CharacterEntry } from '@/types';

export function buildPrompt1(
  sourceLang: string,
  characterDict: CharacterEntry[]
): string {
  return `你是一个专业的语音识别与声纹分析师。请仔细聆听提供的完整音频，提取所有有效语音段落，必须识别并区分不同说话人。
${characterDict.length > 0
    ? `\n【已知常驻角色先验信息（最高优先级）】：\n${JSON.stringify(
        characterDict.map(c => ({ name: c.name, voiceDesc: c.voiceDesc })), null, 2
      )}\n如果听到的声音特征与某角色匹配，speaker 字段请直接填写其【角色名】。\n不匹配的说话人标为"路人甲"、"路人乙"等。\n`
    : '\n未提供常驻角色信息，请根据声音特征自动区分并简要描述说话人。\n'
  }
【输出格式（极度重要）】：
- 强制输出纯 JSON 数组
- 禁止任何 markdown 代码块或说明文字
- 格式：[{"speaker":"角色名","text":"原始${sourceLang}文本","start_time":0.0,"end_time":2.5}]`;
}

export function buildPrompt2(
  targetLang: string,
  characterDict: CharacterEntry[]
): string {
  return `你是一名专业影视翻译与 TTS 配音导演。请处理以下 JSON 数组，完成三项任务：

任务1：翻译
将每条 text 翻译为${targetLang}。
计算 duration = end_time - start_time。
严格控制译文字数（不含空格和换行符）在 duration×4 到 duration×4.5 之间。

任务2：情绪标签
在译文句首添加情绪标签（[excited]/[calm]/[sad]/[angry]/[whispering]/[cheerful]/[serious]），贴合语境。

任务3：TTS 音色
从音色库选最匹配音色：Aoede(温柔女)/Charon(低沉男)/Fenrir(阳刚男)/Kore(清冷女)/Puck(中性)。
${characterDict.length > 0
    ? `\n【强制音色绑定（最高优先级，不可修改）】：\n${JSON.stringify(
        characterDict.map(c => ({ name: c.name, tts_voice: c.defaultVoice })), null, 2
      )}\n`
    : ''
  }
【输出格式（极度重要）】：
- 强制输出纯 JSON 数组，禁止 markdown 包装
- 格式：[{"speaker":"","tts_voice":"Charon","emotion":"[calm]","original_text":"","translated_text":"","start_time":0.0,"end_time":2.5,"duration":2.5}]`;
}
