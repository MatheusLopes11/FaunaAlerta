import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Especies } from './especies/especies.entity.js';
import { EspeciesModule } from './especies/especies.module.js';
import { Usuario } from './usuario/usuario.entity.js';
import { UsuarioModule } from './usuario/usuario.module.js';
import { Pesquisador } from './pesquisador/pesquisador.entity.js';
import { PesquisadorModule } from './pesquisador/pesquisador.module.js';
import { DocumentosVerificacao } from './documentos-verificacao/documentos-verificacao.entity.js';
import { DocumentosVerificacaoModule } from './documentos-verificacao/documentos-verificacao.module.js';
import { Denuncias } from './denuncias/denuncias.entity.js';
import { DenunciasModule } from './denuncias/denuncias.module.js';
import { DenunciaHistorico } from './denuncia_historico/denuncia_historico.entity.js';
import { DenunciaHistoricoModule } from './denuncia_historico/denuncia_historico.module.js';
import { Alerta } from './alertas/alertas.entity.js';
import { AlertaModule } from './alertas/alertas.module.js';
import { AlertaMidia } from './alerta-media/alerta-media.entity.js';
import { AlertaMidiaModule } from './alerta-media/alerta-media.module.js';
import { Ong } from './ong/ong.entity.js';
import { OngsModule } from './ong/ong.module.js';
import { DenunciaRecebida } from './orgao mock/denuncia recebida/Denuncia-Recebida.entity.js';
import { DenunciaRecebidaModule } from './orgao mock/denuncia recebida/denuncia-recebida.module.js';
import { DenunciaMidiaMock } from './orgao mock/denuncia midias/denuncia-midia.entity.js';
import { DenunciaMidiaMockModule } from './orgao mock/denuncia midias/denuncia-media.module.js';
import { EspecieBioma } from './especies/especie-bioma.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Banco de dados Principal
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get<string>('DB_HOST'),
        port: ConfigService.get<number>('DB_PORT'),
        username: ConfigService.get<string>('DB_USER'),
        password: ConfigService.get<string>('DB_PASSWORD'),
        database: ConfigService.get<string>('DB_NAME'),

        entities: [
          Especies,
          EspecieBioma,
          Usuario, 
          Pesquisador, 
          DocumentosVerificacao, 
          Denuncias, 
          DenunciaHistorico, 
          Alerta, 
          AlertaMidia, 
          Ong,
        ],

        // IMPORTANTE: Quando for mexer em algo no banco de dados
        // mude para false(f minusculo), assim vc evita que as tabelas
        // de atualizar automaticamente.
        // Quando terminar de mexer mude para true(t minusculo)
        synchronize: false,
      }),
    }),

    //
    TypeOrmModule.forRootAsync({
      name: 'orgaoMock',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get<string>('DB_HOST'),
        port: ConfigService.get<number>('DB_PORT'),
        username: ConfigService.get<string>('DB_USER'),
        password: ConfigService.get<string>('DB_PASSWORD'),
        database: ConfigService.get<string>('DB_MOCK_NAME'),
        entities: [DenunciaRecebida, DenunciaMidiaMock],
        synchoroniza: false,
      }),
    }),

    EspeciesModule,
    UsuarioModule,
    PesquisadorModule,
    DocumentosVerificacaoModule,
    DenunciasModule,
    DenunciaHistoricoModule,
    AlertaModule,
    AlertaMidiaModule,
    OngsModule,
    DenunciaRecebidaModule,
    DenunciaMidiaMockModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
