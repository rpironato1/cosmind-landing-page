# 🚀 PLANO DE IMPLEMENTAÇÃO PRIORITÁRIO - CosMind v2.0

## 📋 RESUMO EXECUTIVO

Baseado na análise do gap entre o estado atual e o PRD.md v2.0, este documento detalha as ações imediatas para transformar o CosMind de um MVP simples para uma arquitetura empresarial.

## 🎯 FASES DE IMPLEMENTAÇÃO RECOMENDADAS

### 🔥 FASE 1: DECISÃO ARQUITETURAL + INFRAESTRUTURA (Semanas 1-4)
**Objetivo**: Definir arquitetura e estabelecer base para observabilidade

#### 1.1 Decisão Arquitetural (SEMANA 1)
**Prioridade**: CRÍTICA - Definir abordagem antes de implementar

**Opções para Web + Mobile**:

**OPÇÃO A: Multi-repo Simplificado (RECOMENDADO)**
```bash
# Estrutura proposta
cosmind-web/          # Next.js (atual migrado)
├── src/
├── shared/           # Código compartilhado
│   ├── types/
│   ├── api-client/
│   └── utils/
└── package.json

cosmind-mobile/       # React Native (futuro)
cosmind-shared/       # NPM package (quando necessário)
```

**OPÇÃO B: Monorepo Completo**
```bash
cosmind/
├── apps/
│   ├── web/
│   └── mobile/
├── packages/
│   ├── shared/
│   ├── ui/
│   └── utils/
```

**Recomendação**: Começar com Opção A para time pequeno/médio

#### 1.2 Migração Next.js + Observabilidade (SEMANA 2)
**Prioridade**: ALTA - Base tecnológica sólida

**Implementação Simplificada**:
```bash
# 1. Migrar para Next.js 14
npx create-next-app@latest cosmind-web --typescript --tailwind --app

# 2. Mover componentes existentes
cp -r src/components cosmind-web/src/
cp -r src/hooks cosmind-web/src/

# 3. Adicionar observabilidade básica
npm install @opentelemetry/api @opentelemetry/sdk-node prom-client
```

**Arquivos a criar**:
- `src/shared/observability/index.ts` - Sistema básico
- `src/shared/api-client/index.ts` - Cliente API tipado
- `instrumentation.ts` - OpenTelemetry setup

#### 1.3 Circuit Breaker + Cache (SEMANA 3)
**Prioridade**: ALTA - Resiliência de produção

**Implementação**:
```bash
# 1. Adicionar ao projeto atual
mkdir -p src/shared/{resilience,cache}

# 2. Instalar dependências
npm install opossum lru-cache ioredis
```

**Arquivos a criar**:
- `src/shared/resilience/circuit-breaker.ts`
- `src/shared/cache/intelligent-cache.ts`
- `src/shared/api/resilient-client.ts`

#### 1.4 Preparação Mobile (SEMANA 4)
**Prioridade**: MÉDIA - Setup para desenvolvimento mobile

**Implementação**:
```bash
# 1. Extrair shared para NPM package (quando necessário)
# 2. Criar projeto React Native base
npx react-native init CosmindMobile --template react-native-template-typescript

# 3. Setup shared dependencies
```

### ⚡ FASE 2: FEATURE FLAGS E EVENTOS (Semanas 5-8)

#### 2.1 Sistema de Feature Flags (SEMANA 5)
**Objetivo**: Permitir A/B testing e rollouts graduais

#### 2.2 Event-Driven Architecture (SEMANA 6)
**Objetivo**: Desacoplar components via eventos

#### 2.3 Testes MCP Playwright (SEMANA 7-8)
**Objetivo**: 95% cobertura de testes

### 🧪 FASE 3: AVANÇADO E IA (Semanas 9-12)

#### 3.1 RAG Personalizado (SEMANA 9-10)
#### 3.2 ML Cache Prediction (SEMANA 11)
#### 3.3 Load Testing (SEMANA 12)

## 🛠️ IMPLEMENTAÇÃO DETALHADA - FASE 1

### 📊 1. Sistema de Observabilidade

#### 1.1 Estrutura do Package
```typescript
// packages/observability/package.json
{
  "name": "@cosmind/observability",
  "version": "1.0.0",
  "main": "dist/index.js",
  "dependencies": {
    "@opentelemetry/api": "^1.9.0",
    "@opentelemetry/sdk-node": "^0.52.1",
    "prom-client": "^15.1.3",
    "winston": "^3.13.1",
    "@sentry/node": "^8.26.0"
  }
}
```

#### 1.2 Sistema Principal
```typescript
// packages/observability/src/index.ts
import { PrometheusRegistry } from 'prom-client';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { WinstonLogger } from './logging/winston';
import { AlertManager } from './alerts/manager';

export class ObservabilitySystem {
  private metrics: PrometheusRegistry;
  private tracing: NodeSDK;
  private logging: WinstonLogger;
  private alerts: AlertManager;

  constructor() {
    this.setupMetrics();
    this.setupTracing();
    this.setupLogging();
    this.setupAlerts();
  }

  // Métricas de negócio específicas do CosMind
  trackTokenConversion(userId: string, tokensUsed: number): void {
    this.metrics.getSingleMetric('cosmind_token_conversion')
      ?.inc({ user_id: userId }, tokensUsed);
  }

  trackAICost(model: string, cost: number): void {
    this.metrics.getSingleMetric('cosmind_ai_cost')
      ?.set({ model }, cost);
  }

  trackCacheHit(layer: string, hit: boolean): void {
    this.metrics.getSingleMetric('cosmind_cache_hits')
      ?.inc({ layer, hit: hit.toString() });
  }
}
```

#### 1.3 Métricas de Negócio
```typescript
// packages/observability/src/metrics/business.ts
import { Histogram, Gauge, Counter } from 'prom-client';

export const BusinessMetrics = {
  tokenConversionRate: new Histogram({
    name: 'cosmind_token_conversion_rate',
    help: 'Rate of token to revenue conversion',
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0],
    labelNames: ['user_segment', 'package_type']
  }),

  aiCostPerUser: new Gauge({
    name: 'cosmind_ai_cost_per_user_cents',
    help: 'AI cost per user in cents',
    labelNames: ['model_provider', 'feature_type']
  }),

  cacheHitRate: new Counter({
    name: 'cosmind_cache_operations_total',
    help: 'Cache operations by layer and result',
    labelNames: ['layer', 'operation', 'result']
  }),

  userEngagement: new Histogram({
    name: 'cosmind_user_session_duration_seconds',
    help: 'User session duration',
    buckets: [30, 60, 300, 900, 1800, 3600],
    labelNames: ['user_type', 'device_type']
  }),

  revenuePerUser: new Gauge({
    name: 'cosmind_revenue_per_user_brl',
    help: 'Revenue per user in BRL',
    labelNames: ['time_period', 'user_cohort']
  })
};
```

### 🔒 2. Circuit Breaker Implementation

#### 2.1 Cliente Resiliente
```typescript
// packages/ai/src/circuit-breaker/resilient-client.ts
import CircuitBreaker from 'opossum';
import { LRUCache } from 'lru-cache';

interface APIProvider {
  name: string;
  endpoint: string;
  priority: number;
  call: (query: string) => Promise<any>;
}

export class ResilientAPIClient {
  private providers: APIProvider[];
  private breakers: Map<string, CircuitBreaker>;
  private emergencyCache: LRUCache<string, any>;

  constructor() {
    this.providers = [
      { name: 'tavily', endpoint: '/api/tavily', priority: 1, call: this.callTavily },
      { name: 'serpapi', endpoint: '/api/serpapi', priority: 2, call: this.callSerpAPI },
      { name: 'scraperapi', endpoint: '/api/scraperapi', priority: 3, call: this.callScraperAPI }
    ];

    this.emergencyCache = new LRUCache({
      max: 1000,
      ttl: 48 * 60 * 60 * 1000 // 48h cache for emergencies
    });

    this.setupCircuitBreakers();
  }

  private setupCircuitBreakers(): void {
    this.breakers = new Map();

    this.providers.forEach(provider => {
      const breaker = new CircuitBreaker(provider.call.bind(this), {
        timeout: 5000,                    // 5s timeout
        errorThresholdPercentage: 50,     // 50% error rate trips
        resetTimeout: 30000,              // 30s before retry
        volumeThreshold: 10,              // Min requests before trip
        fallback: (query: string) => this.fallbackStrategy(query, provider.name)
      });

      // Eventos para observabilidade
      breaker.on('open', () => {
        console.log(`Circuit breaker OPEN for ${provider.name}`);
        this.recordMetric('circuit_breaker_state', { provider: provider.name, state: 'open' });
      });

      breaker.on('halfOpen', () => {
        console.log(`Circuit breaker HALF-OPEN for ${provider.name}`);
        this.recordMetric('circuit_breaker_state', { provider: provider.name, state: 'half_open' });
      });

      this.breakers.set(provider.name, breaker);
    });
  }

  async fetchAstrologyData(query: string): Promise<any> {
    // Cascade através dos providers em ordem de prioridade
    for (const provider of this.providers.sort((a, b) => a.priority - b.priority)) {
      try {
        const breaker = this.breakers.get(provider.name);
        const result = await breaker?.fire(query);
        
        // Cache resultado bem-sucedido
        this.emergencyCache.set(query, result);
        return result;
      } catch (error) {
        console.warn(`Provider ${provider.name} failed:`, error);
        continue;
      }
    }

    // Todos falharam - usar cache de emergência
    const cached = this.emergencyCache.get(query);
    if (cached) {
      console.log('Using emergency cache');
      return { ...cached, source: 'emergency_cache' };
    }

    throw new Error('All providers failed and no cache available');
  }

  private async fallbackStrategy(query: string, failedProvider: string): Promise<any> {
    // Primeiro, tentar cache
    const cached = this.emergencyCache.get(query);
    if (cached) {
      return { ...cached, source: 'fallback_cache' };
    }

    // Tentar próximo provider na cadeia
    const remainingProviders = this.providers
      .filter(p => p.name !== failedProvider)
      .sort((a, b) => a.priority - b.priority);

    for (const provider of remainingProviders) {
      const breaker = this.breakers.get(provider.name);
      if (breaker?.opened) continue; // Skip se circuit estiver aberto

      try {
        return await provider.call(query);
      } catch (error) {
        continue;
      }
    }

    throw new Error('All fallback strategies failed');
  }
}
```

### 💾 3. Cache Multi-Layer

#### 3.1 Cache Inteligente
```typescript
// packages/cache/src/intelligent-cache.ts
import { Redis } from 'ioredis';
import { LRUCache } from 'lru-cache';

interface CacheOptions {
  ttl?: number;
  layers?: ('L1' | 'L2' | 'L3')[];
  prefetch?: boolean;
}

export class IntelligentCache {
  private L1: LRUCache<string, any>;  // Memory cache
  private L2: Redis;                  // Redis cache
  private L3: CloudflareKV;          // CDN cache
  private accessPatterns: Map<string, AccessPattern>;
  private mlPredictor: CachePredictorML;

  constructor() {
    this.setupLayers();
    this.setupPrediction();
  }

  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();

    // L1 Cache - Memory (sub-millisecond)
    const l1Result = this.L1.get(key);
    if (l1Result) {
      this.recordCacheHit('L1', Date.now() - startTime);
      this.updateAccessPattern(key, 'L1');
      await this.scheduleRelatedPrefetch(key);
      return l1Result;
    }

    // L2 Cache - Redis (< 10ms)
    try {
      const l2Result = await this.L2.get(key);
      if (l2Result) {
        const parsed = JSON.parse(l2Result);
        this.L1.set(key, parsed); // Promote to L1
        this.recordCacheHit('L2', Date.now() - startTime);
        this.updateAccessPattern(key, 'L2');
        return parsed;
      }
    } catch (error) {
      console.warn('L2 cache error:', error);
    }

    // L3 Cache - CDN (< 100ms)
    try {
      const l3Result = await this.L3.get(key);
      if (l3Result) {
        // Promote to upper layers
        this.L1.set(key, l3Result);
        await this.L2.setex(key, this.calculateTTL(key), JSON.stringify(l3Result));
        this.recordCacheHit('L3', Date.now() - startTime);
        return l3Result;
      }
    } catch (error) {
      console.warn('L3 cache error:', error);
    }

    this.recordCacheMiss(key);
    return null;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttl || this.calculateDynamicTTL(key, value);
    const layers = options?.layers || this.selectOptimalLayers(key, value);

    const promises = [];

    if (layers.includes('L1')) {
      this.L1.set(key, value, { ttl });
    }

    if (layers.includes('L2')) {
      promises.push(
        this.L2.setex(key, Math.floor(ttl / 1000), JSON.stringify(value))
      );
    }

    if (layers.includes('L3')) {
      promises.push(
        this.L3.put(key, value, { expirationTtl: Math.floor(ttl / 1000) })
      );
    }

    await Promise.allSettled(promises);

    // Trigger ML learning
    this.updateAccessPattern(key, 'write');
    
    if (options?.prefetch) {
      await this.scheduleRelatedPrefetch(key);
    }
  }

  private calculateDynamicTTL(key: string, value: any): number {
    // Horóscopo diário
    if (key.includes('horoscope:daily')) {
      return 24 * 60 * 60 * 1000; // 24h
    }

    // Dados de usuário
    if (key.includes('user:profile')) {
      return 60 * 60 * 1000; // 1h
    }

    // Análise de compatibilidade
    if (key.includes('compatibility:')) {
      return 7 * 24 * 60 * 60 * 1000; // 7 days
    }

    // ML prediction based on access patterns
    const pattern = this.accessPatterns.get(key);
    if (pattern) {
      return this.mlPredictor.predictOptimalTTL(pattern);
    }

    return 30 * 60 * 1000; // Default 30min
  }

  private async scheduleRelatedPrefetch(key: string): Promise<void> {
    const relatedKeys = await this.mlPredictor.predictRelatedKeys(key);
    
    // Prefetch em background
    setImmediate(async () => {
      for (const relatedKey of relatedKeys.slice(0, 5)) { // Limit to 5 predictions
        const exists = await this.get(relatedKey);
        if (!exists) {
          // Schedule background fetch from origin
          this.scheduleOriginFetch(relatedKey);
        }
      }
    });
  }
}
```

## 📋 CHECKLIST DE IMPLEMENTAÇÃO IMEDIATA

### Semana 1: Observabilidade
- [ ] Criar `packages/observability/`
- [ ] Implementar métricas básicas
- [ ] Setup OpenTelemetry
- [ ] Configurar logging Winston
- [ ] Integrar com aplicação principal

### Semana 2: Circuit Breaker
- [ ] Criar `packages/ai/src/circuit-breaker/`
- [ ] Implementar cliente resiliente
- [ ] Configurar fallback cascade
- [ ] Adicionar cache de emergência
- [ ] Testes de falha

### Semana 3: Cache Multi-Layer
- [ ] Criar `packages/cache/`
- [ ] Implementar L1 (Memory)
- [ ] Configurar L2 (Redis)
- [ ] Setup L3 (Cloudflare KV)
- [ ] ML prediction básico

### Semana 4: Monorepo
- [ ] Migrar para Turborepo
- [ ] Configurar workspaces
- [ ] Atualizar CI/CD
- [ ] Validar build completo

## 🎯 MÉTRICAS DE SUCESSO - FASE 1

### Observabilidade
- [ ] **Dashboard funcional**: Grafana com métricas key
- [ ] **Alertas configurados**: PagerDuty para critical events
- [ ] **Logs estruturados**: 100% de eventos importantes capturados

### Resiliência
- [ ] **Circuit breaker ativo**: Proteção contra API failures
- [ ] **Fallback testado**: 99% uptime mesmo com provider failures
- [ ] **Cache de emergência**: <100ms response em fallback

### Performance
- [ ] **Cache hit rate**: >90% para requests frequentes
- [ ] **Latency reduction**: 50% improvement em responses
- [ ] **Cost reduction**: 70% menos calls para APIs externas

## 🚨 ALERTAS CRÍTICOS PARA CONFIGURAR

```yaml
# alerting-rules.yml
groups:
  - name: cosmind-critical
    rules:
      - alert: HighAICost
        expr: cosmind_ai_cost_per_user_cents > 10
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "AI cost per user exceeding threshold"

      - alert: LowCacheHitRate
        expr: rate(cosmind_cache_operations_total{result="hit"}[5m]) / rate(cosmind_cache_operations_total[5m]) < 0.8
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Cache hit rate below 80%"

      - alert: CircuitBreakerOpen
        expr: cosmind_circuit_breaker_state{state="open"} == 1
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Circuit breaker open for {{ $labels.provider }}"
```

## 💡 PRÓXIMOS PASSOS

1. **Revisar e aprovar** este plano de implementação
2. **Alocar recursos** (1-2 devs sênior para 4 semanas)
3. **Setup environment** (Redis, monitoring tools)
4. **Começar com Semana 1** - Observabilidade
5. **Review semanal** para ajustar roadmap

Este plano transforma o CosMind de um MVP simples para uma arquitetura robusta e escalável, preparada para crescimento empresarial.