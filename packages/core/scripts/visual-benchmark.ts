  findWorkflowTokens,
        const htmlDoc = previewHtml(ir, deck, fonts[entry.id], `${name} · ${entry.id}`);
        const leaked = findWorkflowTokens(htmlDoc);
        if (leaked.length > 0) gateErrors.push(`workflow tokens in preview: ${leaked.join(', ')}`);
        await fs.writeFile(path.join(outDir, htmlName), htmlDoc);
