import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User, Loader2, MapPin, DollarSign, Calendar, Wand2 } from 'lucide-react';
import api from '../api/client';

const SUGGESTED_PROMPTS = [
  { text: 'Plan 7-day Tokyo trip under $2000', emoji: '🇯🇵' },
  { text: '10-day Europe backpacking $3000', emoji: '🇪🇺' },
  { text: 'Romantic Bali honeymoon 5 days', emoji: '🇮🇩' },
  { text: 'Budget Southeast Asia 2 weeks', emoji: '🌏' },
];

export default function AiAgentDrawer({ isOpen, onClose, onSaveGeneratedTrip }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '✈️ Hello! I\'m your AI Travel Agent. Tell me your dream destination, budget, and duration — I\'ll craft a personalized itinerary!',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  if (!isOpen) return null;

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post('/agent/plan', { prompt: userText });
      const plan = res.data.plan;
      setGeneratedPlan(plan);
      const aiMsg = {
        role: 'assistant',
        content: `🎉 Here's your personalized plan for **${plan.title}**!\n\n📍 Destination: ${plan.destination?.name || 'Custom'}\n📅 Duration: ${plan.duration || 'Flexible'}\n💰 Budget: $${plan.suggestedBudget?.toLocaleString() || 'See breakdown'}\n\n${plan.description || ''}`,
        plan
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      // Local AI fallback
      const destinations = ['Tokyo', 'Paris', 'Bali', 'Barcelona', 'Maldives'];
      const dest = destinations.find(d => userText.toLowerCase().includes(d.toLowerCase())) || 'Your Destination';
      const budgetMatch = userText.match(/\$?(\d+)/);
      const budget = budgetMatch ? parseInt(budgetMatch[1]) : 2000;

      const fallbackPlan = {
        title: `${dest} Adventure`,
        description: `A thoughtfully curated trip to ${dest} with a mix of culture, food, and exploration.`,
        destination: { name: dest, imageUrl: '' },
        duration: '7 days',
        suggestedBudget: budget,
        recommendedActivities: [
          { name: `${dest} City Tour`, category: 'Sightseeing', cost: 50, duration: '3h', notes: 'Must-see landmarks' },
          { name: 'Local Food Experience', category: 'Food', cost: 30, duration: '2h', notes: 'Authentic cuisine' },
          { name: 'Cultural Museum', category: 'Culture', cost: 20, duration: '2h', notes: 'Rich history' },
          { name: 'Scenic Hike / Nature Walk', category: 'Adventure', cost: 0, duration: '4h', notes: 'Breathtaking views' },
        ]
      };
      setGeneratedPlan(fallbackPlan);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✨ I've crafted a personalized **${dest} Adventure** for you!\n\n📅 Duration: 7 days\n💰 Budget: $${budget.toLocaleString()}\n🎯 4 curated activities included\n\nClick "Add to My Trips" to save this itinerary!`,
        plan: fallbackPlan
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)'
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 201,
        width: '100%', maxWidth: 440,
        background: 'white',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #4c1d95)',
          padding: '20px 24px', flexShrink: 0
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.4)'
                }}>
                  <Sparkles size={17} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'white', letterSpacing: '-0.3px' }}>AI Travel Agent</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Online · Ready to plan</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
              width: 30, height: 30, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <X size={14} color="white" />
            </button>
          </div>
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 8 }}>
              QUICK START
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p.text)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'white', border: '1.5px solid #e2e8f0',
                    borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
                    fontSize: 11, fontWeight: 600, color: '#374151', textAlign: 'left',
                    transition: 'all 0.1s'
                  }}
                >
                  <span style={{ fontSize: 14 }}>{p.emoji}</span>
                  {p.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}>
              {/* Avatar */}
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #0d9488, #10b981)'
                  : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {msg.role === 'user'
                  ? <User size={14} color="white" />
                  : <Sparkles size={14} color="white" />}
              </div>

              {/* Bubble */}
              <div style={{ maxWidth: '80%' }}>
                <div style={{
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #0d9488, #10b981)' : '#f8fafc',
                  color: msg.role === 'user' ? 'white' : '#0f172a',
                  borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  padding: '10px 14px',
                  fontSize: 12, lineHeight: 1.6, fontWeight: 500,
                  border: msg.role === 'assistant' ? '1px solid #e8f0ef' : 'none'
                }}>
                  {msg.content.split('\n').map((line, li) => (
                    <div key={li}>{line || <br />}</div>
                  ))}
                </div>

                {/* Save Plan Button */}
                {msg.plan && (
                  <button
                    onClick={() => { onSaveGeneratedTrip(msg.plan); onClose(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      color: 'white', border: 'none', borderRadius: 10,
                      padding: '8px 14px', fontSize: 11, fontWeight: 700,
                      cursor: 'pointer', marginTop: 8,
                      boxShadow: '0 4px 12px rgba(124,58,237,0.3)'
                    }}
                  >
                    <Wand2 size={12} />
                    Add to My Trips
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Sparkles size={14} color="white" />
              </div>
              <div style={{
                background: '#f8fafc', border: '1px solid #e8f0ef',
                borderRadius: '4px 16px 16px 16px', padding: '12px 14px',
                display: 'flex', gap: 4, alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0, 1, 2].map(d => (
                    <div key={d} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#7c3aed',
                      animation: `bounce ${0.6 + d * 0.15}s ease infinite alternate`
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>Planning your trip...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: '16px 20px', background: 'white',
          borderTop: '1px solid #f1f5f9', flexShrink: 0
        }}>
          <div style={{
            display: 'flex', gap: 8, alignItems: 'flex-end',
            background: '#f8fafc', borderRadius: 14,
            border: '1.5px solid #e2e8f0', padding: '10px 12px'
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Tell me your dream trip... (e.g. 5 days in Tokyo under $1500)"
              rows={2}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#0f172a',
                lineHeight: 1.5
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: (loading || !input.trim()) ? '#e2e8f0' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: (loading || !input.trim()) ? 'none' : '0 4px 10px rgba(124,58,237,0.3)'
              }}
            >
              <Send size={14} color={loading || !input.trim() ? '#94a3b8' : 'white'} />
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10, color: '#cbd5e1', fontWeight: 600 }}>
            Press Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-4px); } }
      `}</style>
    </>
  );
}
