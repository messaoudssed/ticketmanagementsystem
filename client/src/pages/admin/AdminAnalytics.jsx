import React,{useEffect,useState} from 'react'
import api from '../../services/api'
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts'
export default function AdminAnalytics(){
  const [data,setData]=useState(null), [err,setErr]=useState('')
  useEffect(()=>{(async()=>{ try{ const {data} = await api.get('/admin/analytics/summary'); setData(data) } catch(e){ setErr(e?.response?.data?.message || 'Failed to load analytics') } })()},[])
  if(err) return <p style={{color:'crimson'}}>{err}</p>
  if(!data) return <p>Loading...</p>
  const status = data.byStatus.map(d=>({ name:d._id||'unknown', value:d.count }))
  const assignee = data.byAssignee.map(d=>({ name:d._id||'Unassigned', value:d.count }))
  const priority = data.byPriority.map(d=>({ name:String(d._id), value:d.count }))
  const daily = data.dailyCreated.map(d=>({ date:d._id, value:d.count }))
  return (<div>
    <div className="card" style={{height:360}}><h3>Tickets by Status</h3><ResponsiveContainer width="100%" height="90%"><PieChart><Pie data={status} dataKey="value" nameKey="name" outerRadius={120} label/><Tooltip/><Legend/></PieChart></ResponsiveContainer></div>
    <div className="card" style={{height:360}}><h3>Tickets by Assignee</h3><ResponsiveContainer width="100%" height="90%"><BarChart data={assignee}><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Legend/><Bar dataKey="value"/></BarChart></ResponsiveContainer></div>
    <div className="card" style={{height:360}}><h3>Tickets by Priority</h3><ResponsiveContainer width="100%" height="90%"><BarChart data={priority}><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Legend/><Bar dataKey="value"/></BarChart></ResponsiveContainer></div>
    <div className="card" style={{height:360}}><h3>Daily Created</h3><ResponsiveContainer width="100%" height="90%"><LineChart data={daily}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="date"/><YAxis allowDecimals={false}/><Tooltip/><Legend/><Line type="monotone" dataKey="value"/></LineChart></ResponsiveContainer></div>
  </div>) }
