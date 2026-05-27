export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body;

        // 如果有system prompt，给它加上缓存标记
        if(body.system && typeof body.system === 'string'){
            body.system = [
                {
                    type: 'text',
                    text: body.system,
                    cache_control: { type: 'ephemeral' }
                }
            ];
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-beta': 'prompt-caching-2024-07-31'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        res.status(response.status).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
