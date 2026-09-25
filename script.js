async function downloadApp(platform) {
    const toast = document.getElementById('toast');
    
    // Atualiza o toast para informar que está buscando a versão
    toast.textContent = 'Buscando a versão mais recente...';
    toast.classList.add('show');
    
    try {
        // Consulta a API do GitHub para obter a última release
        const response = await fetch('https://api.github.com/repos/PatrikMaltacm/Prosa-Releases/releases/latest');
        
        if (!response.ok) {
            throw new Error('Falha ao buscar a última versão.');
        }
        
        const data = await response.json();
        const assets = data.assets;
        
        let downloadUrl = '';
        let platformName = '';

        // Procura o arquivo correspondente nos assets da release
        if (platform === 'windows') {
            platformName = 'Windows';
            // Tenta encontrar o instalador .exe (NSIS) ou .msi
            const asset = assets.find(a => a.name.endsWith('-setup.exe') || a.name.endsWith('.msi') || a.name.endsWith('.exe'));
            if (asset) downloadUrl = asset.browser_download_url;
        } else if (platform === 'macos') {
            platformName = 'macOS';
            // Tenta encontrar o arquivo .tar.gz do Mac (ou .dmg se houver)
            const asset = assets.find(a => a.name.endsWith('.app.tar.gz') || a.name.endsWith('.dmg'));
            if (asset) downloadUrl = asset.browser_download_url;
        } else if (platform === 'linux') {
            platformName = 'Linux';
            // Tenta encontrar o AppImage (ou .deb como alternativa)
            const asset = assets.find(a => a.name.endsWith('.AppImage'));
            if (asset) downloadUrl = asset.browser_download_url;
        }
        
        if (downloadUrl) {
            toast.textContent = `Iniciando download da versão ${data.tag_name} para ${platformName}...`;
            
            // Redireciona para o arquivo de fato
            window.location.href = downloadUrl;
        } else {
            toast.textContent = `Arquivo de download para ${platformName} não encontrado na última versão.`;
            toast.style.background = '#f23f42'; // Cor de erro
        }
        
    } catch (error) {
        console.error('Erro ao buscar o download:', error);
        toast.textContent = 'Ocorreu um erro ao buscar o download.';
        toast.style.background = '#f23f42'; // Cor de erro
    }
    
    // Esconde o toast após 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        // Reseta a cor caso tenha dado erro
        setTimeout(() => toast.style.background = '', 300);
    }, 4000);
}
