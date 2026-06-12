import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmaciasService } from '../farmacias/farmacias.service'; 
import { Tienda } from '../tiendas/entities/tienda.entity';

@Injectable()
export class SeoService {
  constructor(
    // Tu servicio de farmacias (trae las farmacias dinámicas)
    private readonly farmaciasService: FarmaciasService,

    // El repositorio de tiendas (reemplaza tus comercios hardcodeados de Vite)
    @InjectRepository(Tienda)
    private readonly tiendaRepository: Repository<Tienda>,
  ) {}

  async generateSitemap(): Promise<string> {
    const baseUrl = 'https://olavarriaconecta.com';

    // 1. Páginas fijas del frontend estructuradas con su propia config de SEO
    const staticPages = [
      { url: '', changefreq: 'daily', priority: '1.0' },                  // Home
      { url: '/farmacias-de-turno', changefreq: 'daily', priority: '0.9' }, // <-- Corregido el slug y con prioridad alta
      { url: '/nosotros', changefreq: 'weekly', priority: '0.5' },
      { url: '/planes', changefreq: 'weekly', priority: '0.5' },
      { url: '/terminos-y-condiciones', changefreq: 'monthly', priority: '0.3' },
      { url: '/politica-de-privacidad', changefreq: 'monthly', priority: '0.3' }
    ];

    // 2. Traemos las farmacias y los comercios reales en paralelo de MySQL
    const [farmacias, tiendas] = await Promise.all([
      this.farmaciasService.findAll(),
      this.tiendaRepository.find({ select: ['slug'] }), // Solo el slug para optimizar rendimiento
    ]);

    // 3. Empezamos a armar el XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // 4. Inyectamos las páginas estáticas institucionales configuradas arriba
    staticPages.forEach((page) => {
      xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // 5. Inyectamos los comercios de forma 100% DINÁMICA
    tiendas.forEach((tienda) => {
      if (tienda.slug) {
        xml += `
  <url>
    <loc>${baseUrl}/${tienda.slug.trim()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    });

    // 6. Inyectamos las farmacias dinámicas colgando de la ruta correcta
    farmacias.forEach((farmacia: any) => {
      const slugFarmacia = farmacia.slug || farmacia.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      xml += `
  <url>
    <loc>${baseUrl}/farmacias-de-turno/${slugFarmacia}</loc> <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += `\n</urlset>`;
    
    return xml;
  }
}