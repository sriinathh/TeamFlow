<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '../components/ui/ThemeToggle.vue'

const router = useRouter()

const mobileMenuOpen = ref(false)
const scrolled = ref(false)

function onScroll() { scrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const features = [
  { icon: 'kanban', title: 'Kanban Boards', desc: 'Drag-and-drop task management with real-time updates across your entire team.' },
  { icon: 'chat', title: 'Real-Time Chat', desc: 'Channels, direct messages, threads, and emoji reactions powered by Socket.IO.' },
  { icon: 'notes', title: 'Collaborative Notes', desc: 'Notion-style rich text editor with markdown support and version history.' },
  { icon: 'calendar', title: 'Smart Calendar', desc: 'Task deadlines, meetings, and milestones in one unified calendar view.' },
  { icon: 'analytics', title: 'Analytics Dashboard', desc: 'Track team productivity, project progress, and task distribution with charts.' },
  { icon: 'shield', title: 'Enterprise Security', desc: 'JWT auth, role-based access, XSS protection, and secure file management.' },
]

const stats = [
  { value: '50K+', label: 'Active Teams' },
  { value: '2M+', label: 'Tasks Completed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
]

const testimonials = [
  { name: 'Jordan Mitchell', role: 'CTO, Streamline Labs', avatar: 'JM', text: 'TeamFlow replaced four separate tools for us. The real-time chat and Kanban boards are buttery smooth. Our team productivity jumped 40%.' },
  { name: 'Aisha Rahman', role: 'Head of Product, Nimbus', avatar: 'AR', text: 'The collaborative notes feature is a game changer. Our entire product wiki lives in TeamFlow now. The UI is absolutely gorgeous.' },
  { name: 'David Park', role: 'Engineering Lead, Quantix', avatar: 'DP', text: 'The analytics dashboard gives me real insight into our team\'s velocity. It\'s like having a project manager that never sleeps.' },
]

const pricing = [
  { name: 'Free', price: '$0', period: 'forever', desc: 'For small teams getting started', features: ['Up to 10 members', '3 projects', 'Real-time chat', '1 GB storage', 'Basic analytics'], cta: 'Get Started', popular: false },
  { name: 'Pro', price: '$12', period: 'per user/month', desc: 'For growing teams that need more', features: ['Unlimited members', 'Unlimited projects', 'Advanced analytics', '100 GB storage', 'Meeting scheduling', 'Priority support'], cta: 'Start Free Trial', popular: true },
  { name: 'Enterprise', price: 'Custom', period: 'contact us', desc: 'For large organizations', features: ['Everything in Pro', 'SSO & SAML', 'Unlimited storage', 'Custom integrations', 'Dedicated support', 'SLA guarantee'], cta: 'Contact Sales', popular: false },
]

const faqs = [
  { q: 'Is TeamFlow really free?', a: 'Yes! The Free plan includes up to 10 members, 3 projects, and real-time chat. No credit card required.' },
  { q: 'Can I migrate from other tools?', a: 'Absolutely. We support imports from Trello, Asana, Jira, and Notion. Your data can be migrated in minutes.' },
  { q: 'Is my data secure?', a: 'We use enterprise-grade security including JWT authentication, password hashing, XSS protection, and encrypted file storage.' },
  { q: 'Do you offer offline support?', a: 'Yes, TeamFlow is a PWA with offline mode. You can continue working and your changes sync when you reconnect.' },
  { q: 'Can I customize the workspace?', a: 'Every workspace can be customized with logos, banners, themes, and custom labels to match your brand.' },
]

const openFaq = ref<number | null>(0)
function toggleFaq(i: number) { openFaq.value = openFaq.value === i ? null : i }

const featureIcons: Record<string, string> = {
  kanban: 'M3 3h18v18H3z M9 3v18 M15 3v18',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  notes: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
  calendar: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  analytics: 'M18 20V10 M12 20V4 M6 20v-6',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
}
</script>

<template>
  <div class="landing">
    <!-- Navbar -->
    <nav class="navbar" :class="{ scrolled }">
      <div class="container nav-inner">
        <div class="nav-brand">
          <div class="brand-mark">T</div>
          <span>TeamFlow</span>
        </div>
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <div class="nav-actions">
          <ThemeToggle />
          <button class="nav-login" @click="router.push('/login')">Sign In</button>
          <button class="nav-cta" @click="router.push('/register')">Get Started Free</button>
        </div>
        <button class="nav-mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
      <Transition name="fade">
        <div v-if="mobileMenuOpen" class="mobile-menu">
          <a href="#features" @click="mobileMenuOpen = false">Features</a>
          <a href="#testimonials" @click="mobileMenuOpen = false">Testimonials</a>
          <a href="#pricing" @click="mobileMenuOpen = false">Pricing</a>
          <a href="#faq" @click="mobileMenuOpen = false">FAQ</a>
          <button class="nav-cta" @click="router.push('/register')">Get Started Free</button>
        </div>
      </Transition>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-blob blob-1" />
        <div class="hero-blob blob-2" />
        <div class="hero-grid" />
      </div>
      <div class="container hero-inner">
        <div class="hero-badge animate-slide-down">
          <span class="pulse-dot" /> New: AI-powered meeting notes are here
        </div>
        <h1 class="hero-title animate-slide-up">
          Plan. Collaborate.<br />
          <span class="gradient-text">Deliver.</span>
        </h1>
        <p class="hero-subtitle animate-slide-up" style="animation-delay: 0.1s">
          The all-in-one platform that combines projects, chat, docs, and meetings.<br />
          Everything your team needs to move fast — in one beautiful place.
        </p>
        <div class="hero-cta animate-slide-up" style="animation-delay: 0.2s">
          <button class="btn-primary-lg" @click="router.push('/register')">
            Start for Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button class="btn-secondary-lg" @click="router.push('/login')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Live Demo
          </button>
        </div>
        <p class="hero-note animate-fade" style="animation-delay: 0.3s">No credit card required · Free forever for small teams</p>

        <!-- App preview mockup -->
        <div class="hero-preview animate-slide-up" style="animation-delay: 0.35s">
          <div class="preview-window glass">
            <div class="preview-bar">
              <span class="dot red" /><span class="dot yellow" /><span class="dot green" />
            </div>
            <div class="preview-content">
              <div class="preview-sidebar">
                <div class="ps-logo">T</div>
                <div class="ps-nav">
                  <div class="ps-item active" /><div class="ps-item" /><div class="ps-item" />
                  <div class="ps-item" /><div class="ps-item" />
                </div>
              </div>
              <div class="preview-main">
                <div class="pm-header">
                  <div class="pm-title" />
                  <div class="pm-avatar" />
                </div>
                <div class="pm-board">
                  <div class="pm-col">
                    <div class="pm-col-header">To Do</div>
                    <div class="pm-card" /><div class="pm-card short" />
                  </div>
                  <div class="pm-col">
                    <div class="pm-col-header">In Progress</div>
                    <div class="pm-card" /><div class="pm-card" /><div class="pm-card short" />
                  </div>
                  <div class="pm-col">
                    <div class="pm-col-header">Done</div>
                    <div class="pm-card short" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="s in stats" :key="s.label" class="stat-card">
            <div class="stat-value gradient-text">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Features</span>
          <h2>Everything your team needs</h2>
          <p>One platform to replace them all. Powerful enough for enterprises, simple enough for startups.</p>
        </div>
        <div class="features-grid">
          <div v-for="(f, i) in features" :key="f.title" class="feature-card card card-hover" :style="{ animationDelay: `${i * 0.05}s` }">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="featureIcons[f.icon]" /></svg>
            </div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Testimonials</span>
          <h2>Loved by teams worldwide</h2>
          <p>Join thousands of teams already working smarter with TeamFlow.</p>
        </div>
        <div class="testimonials-grid">
          <div v-for="t in testimonials" :key="t.name" class="testimonial-card card">
            <div class="stars">★★★★★</div>
            <p class="testimonial-text">"{{ t.text }}"</p>
            <div class="testimonial-author">
              <div class="ta-avatar">{{ t.avatar }}</div>
              <div>
                <div class="ta-name">{{ t.name }}</div>
                <div class="ta-role">{{ t.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="pricing-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Pricing</span>
          <h2>Simple, transparent pricing</h2>
          <p>Start free. Upgrade when you need more. Cancel anytime.</p>
        </div>
        <div class="pricing-grid">
          <div v-for="p in pricing" :key="p.name" class="pricing-card card" :class="{ popular: p.popular }">
            <div v-if="p.popular" class="popular-badge">Most Popular</div>
            <h3>{{ p.name }}</h3>
            <p class="pricing-desc">{{ p.desc }}</p>
            <div class="pricing-price">
              <span class="price">{{ p.price }}</span>
              <span class="period">{{ p.period }}</span>
            </div>
            <button class="pricing-cta" :class="{ primary: p.popular }" @click="router.push('/register')">{{ p.cta }}</button>
            <ul class="pricing-features">
              <li v-for="feat in p.features" :key="feat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                {{ feat }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="faq-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">FAQ</span>
          <h2>Frequently asked questions</h2>
        </div>
        <div class="faq-list">
          <div v-for="(faq, i) in faqs" :key="i" class="faq-item" :class="{ open: openFaq === i }">
            <button class="faq-q" @click="toggleFaq(i)">
              <span>{{ faq.q }}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-chevron"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <Transition name="fade">
              <div v-if="openFaq === i" class="faq-a"><p>{{ faq.a }}</p></div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card glass">
          <h2>Ready to transform<br />how your team works?</h2>
          <p>Join 50,000+ teams already using TeamFlow to ship faster.</p>
          <button class="btn-primary-lg" @click="router.push('/register')">Get Started — It's Free</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="nav-brand">
              <div class="brand-mark">T</div>
              <span>TeamFlow</span>
            </div>
            <p>Plan. Collaborate. Deliver. The all-in-one team collaboration platform.</p>
          </div>
          <div class="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
          </div>
          <div class="footer-col">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Support</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2025 TeamFlow. All rights reserved.</span>
          <div class="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing { overflow-x: hidden; }

/* Navbar */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: var(--z-topbar);
  transition: all 0.3s ease; padding: 16px 0;
}
.navbar.scrolled {
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  padding: 10px 0;
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; }
.nav-brand { display: flex; align-items: center; gap: 10px; font-size: 1.2rem; font-weight: 700; }
.brand-mark {
  width: 32px; height: 32px; border-radius: 8px;
  background: var(--gradient-brand); color: white;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; box-shadow: 0 2px 8px rgba(59,130,246,0.3);
}
.nav-links { display: flex; gap: 28px; }
.nav-links a { color: var(--text-secondary); font-weight: 500; font-size: 0.9rem; transition: color 0.15s; }
.nav-links a:hover { color: var(--text-primary); }
.nav-actions { display: flex; align-items: center; gap: 10px; }
.nav-login { color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; padding: 8px 16px; }
.nav-login:hover { color: var(--text-primary); }
.nav-cta {
  background: var(--gradient-brand); color: white;
  padding: 10px 20px; border-radius: var(--radius-md);
  font-weight: 600; font-size: 0.9rem;
  box-shadow: 0 4px 14px rgba(59,130,246,0.3);
  transition: all 0.2s;
}
.nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,0.4); }
.nav-mobile-toggle { display: none; color: var(--text-primary); }
.mobile-menu { display: none; flex-direction: column; gap: 16px; padding: 20px 24px; background: var(--bg-surface); border-bottom: 1px solid var(--border-color); }

/* Hero */
.hero { position: relative; padding: 140px 0 60px; text-align: center; }
.hero-bg { position: absolute; inset: 0; overflow: hidden; z-index: -1; }
.hero-blob {
  position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15;
}
.blob-1 { width: 500px; height: 500px; background: var(--brand-500); top: -100px; left: -100px; }
.blob-2 { width: 400px; height: 400px; background: var(--accent-500); top: 50px; right: -100px; }
.hero-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  opacity: 0.4;
}
.hero-inner { position: relative; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 16px; border-radius: 20px;
  background: var(--bg-surface); border: 1px solid var(--border-color);
  font-size: 0.82rem; font-weight: 500; color: var(--text-secondary);
  box-shadow: var(--shadow-sm);
}
.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--success-500); animation: pulse-glow 2s infinite;
}
.hero-title { font-size: clamp(2.8rem, 7vw, 5rem); font-weight: 800; line-height: 1.05; margin: 24px 0; letter-spacing: -0.04em; }
.hero-subtitle { font-size: clamp(1.05rem, 2vw, 1.3rem); color: var(--text-secondary); max-width: 640px; margin: 0 auto; line-height: 1.6; }
.hero-cta { display: flex; gap: 14px; justify-content: center; margin-top: 32px; flex-wrap: wrap; }
.btn-primary-lg, .btn-secondary-lg {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: var(--radius-md);
  font-weight: 600; font-size: 1rem; transition: all 0.2s;
}
.btn-primary-lg { background: var(--gradient-brand); color: white; box-shadow: 0 4px 14px rgba(59,130,246,0.3); }
.btn-primary-lg:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.4); }
.btn-secondary-lg { background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); }
.btn-secondary-lg:hover { border-color: var(--brand-400); color: var(--brand-600); }
.hero-note { font-size: 0.85rem; color: var(--text-muted); margin-top: 14px; }

/* Preview mockup */
.hero-preview { margin-top: 60px; perspective: 1200px; }
.preview-window {
  max-width: 920px; margin: 0 auto; border-radius: var(--radius-xl);
  overflow: hidden; box-shadow: var(--shadow-lg); border: 1px solid var(--border-color);
  transform: rotateX(6deg); transition: transform 0.3s;
}
.preview-window:hover { transform: rotateX(0deg); }
.preview-bar { display: flex; gap: 6px; padding: 12px 16px; background: var(--bg-surface-2); border-bottom: 1px solid var(--border-color); }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot.red { background: #ff5f57; } .dot.yellow { background: #febc2e; } .dot.green { background: #28c840; }
.preview-content { display: flex; height: 360px; background: var(--bg-base); }
.preview-sidebar { width: 60px; background: var(--bg-surface); border-right: 1px solid var(--border-color); padding: 12px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.ps-logo { width: 32px; height: 32px; border-radius: 8px; background: var(--gradient-brand); }
.ps-nav { display: flex; flex-direction: column; gap: 8px; width: 100%; align-items: center; }
.ps-item { width: 32px; height: 32px; border-radius: 8px; background: var(--bg-surface-2); }
.ps-item.active { background: var(--brand-100); }
.preview-main { flex: 1; padding: 20px; }
.pm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.pm-title { width: 160px; height: 16px; border-radius: 4px; background: var(--bg-surface-2); }
.pm-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--gradient-accent); }
.pm-board { display: flex; gap: 12px; }
.pm-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.pm-col-header { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; padding: 4px 0; }
.pm-card { height: 60px; border-radius: var(--radius-sm); background: var(--bg-surface); border: 1px solid var(--border-color); animation: shimmer 2s infinite; }
.pm-card.short { height: 40px; }

/* Stats */
.stats-section { padding: 60px 0; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.stat-card { text-align: center; }
.stat-value { font-size: 2.8rem; font-weight: 800; letter-spacing: -0.03em; }
.stat-label { font-size: 0.9rem; color: var(--text-muted); margin-top: 4px; }

/* Section header */
.section-header { text-align: center; max-width: 600px; margin: 0 auto 48px; }
.section-tag {
  display: inline-block; padding: 4px 14px; border-radius: 20px;
  background: var(--brand-50); color: var(--brand-600);
  font-size: 0.78rem; font-weight: 600; margin-bottom: 16px;
}
.section-header h2 { font-size: clamp(1.8rem, 4vw, 2.6rem); margin-bottom: 12px; }
.section-header p { font-size: 1.05rem; color: var(--text-secondary); }

/* Features */
.features-section { padding: 80px 0; }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.feature-card { padding: 32px; animation: slideUp 0.5s ease both; }
.feature-icon {
  width: 48px; height: 48px; border-radius: var(--radius-md);
  background: var(--brand-50); color: var(--brand-600);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px;
}
.feature-card h3 { font-size: 1.2rem; margin-bottom: 8px; }
.feature-card p { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; }

/* Testimonials */
.testimonials-section { padding: 80px 0; background: var(--bg-surface-2); }
.testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.testimonial-card { padding: 28px; }
.stars { color: #f59e0b; font-size: 1rem; margin-bottom: 12px; letter-spacing: 2px; }
.testimonial-text { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.7; margin-bottom: 20px; }
.testimonial-author { display: flex; align-items: center; gap: 12px; }
.ta-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--gradient-brand); color: white;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.8rem;
}
.ta-name { font-weight: 600; font-size: 0.88rem; }
.ta-role { font-size: 0.78rem; color: var(--text-muted); }

/* Pricing */
.pricing-section { padding: 80px 0; }
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: start; }
.pricing-card { padding: 32px; position: relative; }
.pricing-card.popular { border-color: var(--brand-400); box-shadow: var(--shadow-glow); }
.popular-badge {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  background: var(--gradient-brand); color: white;
  padding: 4px 16px; border-radius: 20px;
  font-size: 0.72rem; font-weight: 700; white-space: nowrap;
}
.pricing-card h3 { font-size: 1.3rem; }
.pricing-desc { color: var(--text-muted); font-size: 0.85rem; margin-top: 4px; }
.pricing-price { display: flex; align-items: baseline; gap: 6px; margin: 20px 0; }
.price { font-size: 2.4rem; font-weight: 800; letter-spacing: -0.03em; }
.period { font-size: 0.82rem; color: var(--text-muted); }
.pricing-cta {
  width: 100%; padding: 12px; border-radius: var(--radius-md);
  font-weight: 600; font-size: 0.9rem; transition: all 0.2s;
  background: var(--bg-surface-2); color: var(--text-primary);
  border: 1px solid var(--border-color);
}
.pricing-cta:hover { border-color: var(--brand-400); }
.pricing-cta.primary { background: var(--gradient-brand); color: white; border: none; box-shadow: 0 4px 14px rgba(59,130,246,0.3); }
.pricing-cta.primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,0.4); }
.pricing-features { list-style: none; margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
.pricing-features li { display: flex; align-items: center; gap: 10px; font-size: 0.88rem; color: var(--text-secondary); }
.pricing-features svg { color: var(--success-500); flex-shrink: 0; }

/* FAQ */
.faq-section { padding: 80px 0; }
.faq-list { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
.faq-item { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; transition: border-color 0.15s; }
.faq-item.open { border-color: var(--brand-400); }
.faq-q { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 18px 24px; font-weight: 600; font-size: 0.95rem; text-align: left; color: var(--text-primary); }
.faq-chevron { color: var(--text-muted); transition: transform 0.2s; flex-shrink: 0; }
.faq-item.open .faq-chevron { transform: rotate(180deg); }
.faq-a { padding: 0 24px 18px; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }

/* CTA */
.cta-section { padding: 80px 0; }
.cta-card {
  text-align: center; padding: 64px 32px;
  border-radius: var(--radius-xl); border: 1px solid var(--border-color);
  background: var(--bg-glass); backdrop-filter: blur(16px);
  position: relative; overflow: hidden;
}
.cta-card::before {
  content: ''; position: absolute; inset: 0;
  background: var(--gradient-brand); opacity: 0.05;
}
.cta-card h2 { font-size: clamp(1.8rem, 4vw, 2.4rem); margin-bottom: 12px; position: relative; }
.cta-card p { color: var(--text-secondary); margin-bottom: 28px; position: relative; }
.cta-card .btn-primary-lg { position: relative; }

/* Footer */
.footer { padding: 60px 0 30px; border-top: 1px solid var(--border-color); }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 40px; }
.footer-brand p { color: var(--text-muted); font-size: 0.88rem; margin-top: 12px; max-width: 280px; }
.footer-col h4 { font-size: 0.9rem; margin-bottom: 14px; }
.footer-col a { display: block; color: var(--text-muted); font-size: 0.85rem; padding: 4px 0; transition: color 0.15s; }
.footer-col a:hover { color: var(--text-primary); }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid var(--border-color); font-size: 0.82rem; color: var(--text-muted); }
.footer-links { display: flex; gap: 20px; }
.footer-links a { color: var(--text-muted); }
.footer-links a:hover { color: var(--text-primary); }

/* Responsive */
@media (max-width: 900px) {
  .nav-links, .nav-actions .nav-login, .nav-actions .nav-cta { display: none; }
  .nav-mobile-toggle { display: flex; color: var(--text-primary); }
  .mobile-menu { display: flex; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .features-grid, .testimonials-grid, .pricing-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
  .preview-content { height: 280px; }
}
@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr; }
  .hero { padding: 110px 0 40px; }
}
</style>
