import axios, { AxiosInstance } from 'axios';
import log from 'loglevel';

export class Chat {
  private server: AxiosInstance;

  constructor(apikey: string) {
    this.server = axios.create({
      baseURL: process.env.DIFY_API_ENDPOINT || 'https://api.dify.ai',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`,
      },
    });
  }

  public codeReview = async (patch: string) => {
    if (!patch) {
      return '';
    }

    console.time('code-review cost');

    const res = await this.server.post(
      '/v1/chat-messages',
      {
        inputs: {
          github_pull_request_patch: patch,
        },
        query: '请生成代码变更复审建议',
        response_mode: 'streaming',
        user: 'github-action-robot',
      },
      {
        responseType: 'stream', // 添加这个配置来接收流数据
      }
    );

    let result = '';

    try {
      // 处理流式响应
      for await (const chunk of res.data) {
        log.info(chunk, 'chunk');
        const lines = chunk.data.toString('utf-8').split('\n').filter(Boolean);
        log.info(lines, 'lines');

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            log.info(data, '============data============');
            if (data.event === 'agent_message' && data.answer) {
              result += data.answer;
            }
          } catch (e) {
            console.error('Parse chunk failed:', e);
          }
        }
      }
    } catch (e) {
      console.error('Process stream failed:', e);
    }

    console.timeEnd('code-review cost');

    return result;
  };
}
