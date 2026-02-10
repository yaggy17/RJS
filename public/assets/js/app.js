const demoData = {
  users:[{name:'Asha Admin',role:'admin',status:'active'},{name:'Mohan Manager',role:'manager',status:'active'},{name:'Teena Member',role:'member',status:'active'}],
  projects:[{name:'Tenant Portal Revamp',start:'2026-02-01',end:'2026-03-15'},{name:'Client Analytics',start:'2026-02-07',end:'2026-04-01'}],
  tasks:[
    {title:'API auth middleware',priority:'high',deadline:'2026-02-12',status:'in_progress',label:'Urgent & Important',assignee:'Teena Member',hours:10},
    {title:'Resource report UI',priority:'medium',deadline:'2026-02-20',status:'todo',label:'Important but Not Urgent',assignee:'Teena Member',hours:8},
    {title:'Backlog cleanup',priority:'low',deadline:'2026-02-13',status:'todo',label:'Urgent but Not Important',assignee:'Teena Member',hours:4}
  ]
};

function mountHeader(title, role='Guest') {
  const host = document.getElementById('header');
  if (!host) return;
  host.innerHTML = `<header><h1>PROJEXON · ${title}</h1><span class="badge">Role: ${role}</span></header>`;
}

function mountNav(links) {
  const host = document.getElementById('nav');
  if (!host) return;
  host.innerHTML = `<div class="nav">${links.map(([href,label])=>`<a href="${href}">${label}</a>`).join('')}</div>`;
}

function renderUsersTable(id='usersTable') {
  const el=document.getElementById(id); if(!el) return;
  el.innerHTML = `<tr><th>Name</th><th>Role</th><th>Status</th></tr>` + demoData.users.map(u=>`<tr><td>${u.name}</td><td>${u.role}</td><td>${u.status}</td></tr>`).join('');
}

function renderProjects(id='projectList') {
  const el=document.getElementById(id); if(!el) return;
  el.innerHTML=demoData.projects.map(p=>`<li>${p.name} (${p.start} → ${p.end})</li>`).join('');
}

function renderTasks(id='taskTable', onlyMine=false) {
  const el=document.getElementById(id); if(!el) return;
  const rows=(onlyMine?demoData.tasks.filter(t=>t.assignee==='Teena Member'):demoData.tasks)
    .map(t=>`<tr><td>${t.title}</td><td>${t.priority}</td><td>${t.deadline}</td><td>${t.label}</td><td><span class="status ${t.status}">${t.status}</span></td></tr>`).join('');
  el.innerHTML=`<tr><th>Task</th><th>Priority</th><th>Deadline</th><th>Eisenhower</th><th>Status</th></tr>${rows}`;
}

function drawSimpleCharts(ids) {
  if (typeof Chart === 'undefined') return;
  ids.forEach((id) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    new Chart(canvas, {
      type: id.includes('pie') ? 'pie' : 'bar',
      data: {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [{ label: 'Tasks', data: [2, 1, 0], backgroundColor: ['#4f8cff', '#ffb020', '#1dbf73'] }]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: '#e7ecf7' } } }, scales: { x: { ticks: { color: '#e7ecf7' } }, y: { ticks: { color: '#e7ecf7' } } } }
    });
  });
}

window.PROJEXON = { mountHeader, mountNav, renderUsersTable, renderProjects, renderTasks, drawSimpleCharts, demoData };
