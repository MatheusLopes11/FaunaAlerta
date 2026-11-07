import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const DIR_UPLOADS = join(process.cwd(), 'uploads');
export const MAX_ARQUIVOS = 3;
export const LIMITE_FOTO = 10 * 1024 * 1024;
export const LIMITE_VIDEO = 30 * 1024 * 1024;

// Formato do arquivo que o multer entrega (guardado em memória).
export interface ArquivoEnviado {
    originalname: string;
    size: number;
    buffer: Buffer;
}

export interface MidiaSalva {
    tipo: 'FOTO' | 'VIDEO';
    url: string;
}

// Fotos do iPhone em HEIC/AVIF usam o mesmo "envelope" do MP4, então são recusadas à parte.
const MARCAS_NAO_SUPORTADAS = new Set(['heic', 'heix', 'hevc', 'heim', 'heis', 'hevm', 'hevs', 'mif1', 'msf1', 'avif', 'avis']);

// Descobre o tipo pelos primeiros bytes do arquivo.
function detectar(buf: Buffer): { ext: string; tipo: 'FOTO' | 'VIDEO' } | null {
    if (buf.length < 12) return null;
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: 'jpg', tipo: 'FOTO' };
    if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: 'png', tipo: 'FOTO' };
    if (buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP') return { ext: 'webp', tipo: 'FOTO' };
    if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return { ext: 'webm', tipo: 'VIDEO' };
    if (buf.toString('latin1', 4, 8) === 'ftyp') {
        const marca = buf.toString('latin1', 8, 12).trim().toLowerCase();
        if (MARCAS_NAO_SUPORTADAS.has(marca)) return null;
        return marca === 'qt' ? { ext: 'mov', tipo: 'VIDEO' } : { ext: 'mp4', tipo: 'VIDEO' };
    }
    return null;
}

export async function apagarArquivos(urls: string[]): Promise<void> {
    for (const url of urls) {
        const nome = url.replace('/uploads/', '');
        // só apaga nomes no formato que nós mesmos geramos
        if (!/^[0-9a-f-]{36}\.(jpg|png|webp|mp4|mov|webm)$/.test(nome)) continue;
        await unlink(join(DIR_UPLOADS, nome)).catch(() => undefined);
    }
}

// Valida todos os arquivos antes de gravar qualquer um.
export async function salvarArquivos(arquivos: ArquivoEnviado[] = []): Promise<MidiaSalva[]> {
    if (arquivos.length === 0) return [];
    if (arquivos.length > MAX_ARQUIVOS) {
        throw new BadRequestException(`Envie no máximo ${MAX_ARQUIVOS} arquivos.`);
    }

    const validos = arquivos.map((a, i) => {
        const t = detectar(a.buffer);
        if (!t) {
            throw new BadRequestException(
                `Arquivo ${i + 1}: formato não aceito. Envie fotos JPG, PNG ou WebP, ou vídeos MP4, MOV ou WebM.`,
            );
        }
        if (t.tipo === 'FOTO' && a.size > LIMITE_FOTO) {
            throw new BadRequestException(`Arquivo ${i + 1}: a foto passa de ${LIMITE_FOTO / 1024 / 1024} MB.`);
        }
        if (t.tipo === 'VIDEO' && a.size > LIMITE_VIDEO) {
            throw new BadRequestException(`Arquivo ${i + 1}: o vídeo passa de ${LIMITE_VIDEO / 1024 / 1024} MB.`);
        }
        return { ...t, buffer: a.buffer };
    });

    await mkdir(DIR_UPLOADS, { recursive: true });
    const salvos: MidiaSalva[] = [];
    try {
        for (const v of validos) {
            const nome = `${randomUUID()}.${v.ext}`;
            await writeFile(join(DIR_UPLOADS, nome), v.buffer);
            salvos.push({ tipo: v.tipo, url: `/uploads/${nome}` });
        }
    } catch (e) {
        await apagarArquivos(salvos.map((s) => s.url));
        throw e;
    }
    return salvos;
}