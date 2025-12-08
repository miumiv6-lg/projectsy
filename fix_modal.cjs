
const fs = require('fs');
const path = 'pages/GmodInterface.tsx';

try {
    const content = fs.readFileSync(path, 'utf8');
    const lines = content.split('\n');

    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('{/* Menu News Modal */}')) {
            startIndex = i;
        }
        if (lines[i].includes('{/* === CLICK TO START === */}')) {
            endIndex = i;
            break;
        }
    }

    if (startIndex === -1 || endIndex === -1) {
        console.error('Could not find start or end anchors');
        process.exit(1);
    }

    const newContent = `        {/* Menu News Modal */}
        {menuSelectedNews && (
          <div
            className="absolute inset-0 z-60 bg-black/80 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-200"
            onClick={() => setMenuSelectedNews(null)}
          >
            <div
              className="w-full max-w-2xl bg-[#1C1C1E] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-56 relative overflow-hidden">
                <img
                  src={menuSelectedNews.imageUrl}
                  alt={menuSelectedNews.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-transparent to-transparent" />
                <button
                  onClick={() => setMenuSelectedNews(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  ✕
                </button>
                <span className={\`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide \${menuSelectedNews.tagColor} text-white\`}>
                  {menuSelectedNews.tag}
                </span>
              </div>
              <div className="p-8">
                <div className="text-gray-500 text-sm mb-2">{menuSelectedNews.date}</div>
                <h2 className="text-2xl font-bold text-white mb-4">{menuSelectedNews.title}</h2>
                <p className="text-gray-300 leading-relaxed">{menuSelectedNews.content}</p>
              </div>
            </div>
          </div>
        )}
      )}
`;

    // Replace lines from startIndex to endIndex - 1 with newContent
    // We want to keep the endIndex line (CLICK TO START)

    // Construct the new file content
    const before = lines.slice(0, startIndex).join('\n');
    const after = lines.slice(endIndex).join('\n');

    const finalContent = before + '\n' + newContent + '\n' + after;

    fs.writeFileSync(path, finalContent);
    console.log('Successfully fixed GmodInterface.tsx');

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
