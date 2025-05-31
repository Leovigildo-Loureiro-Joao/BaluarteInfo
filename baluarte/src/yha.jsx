import { useState } from 'react';
import { LiaSearchSolid } from 'react-icons/lia';

const ActivitiesSection = () => {
  // Estado para o termo de pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para os filtros
  const [filters, setFilters] = useState({
    organizer: '',
    eventType: '',
    theme: '',
    targetAudience: ''
  });
  
  // Dados de exemplo (substitua pelos seus dados reais)
  const activities = [
    {
      id: 1,
      title: 'Retiro Espiritual',
      organizer: 'Grupo de Jovens',
      eventType: 'Retiro',
      theme: 'Espiritualidade',
      targetAudience: 'Jovens',
      description: 'Um fim de semana de reflexão e oração.'
    },
    // ... mais atividades
  ];
  
  // Função para filtrar atividades
  const filteredActivities = activities.filter(activity => {
    // Filtro por termo de pesquisa (verifica título e descrição)
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtros adicionais
    const matchesOrganizer = !filters.organizer || activity.organizer === filters.organizer;
    const matchesEventType = !filters.eventType || activity.eventType === filters.eventType;
    const matchesTheme = !filters.theme || activity.theme === filters.theme;
    const matchesAudience = !filters.targetAudience || activity.targetAudience === filters.targetAudience;
    
    return matchesSearch && matchesOrganizer && matchesEventType && matchesTheme && matchesAudience;
  });

  return (
    <section className="activities-section">
      <div className="h2-title sec">
        <h1>Actividades</h1>
        <span></span>
      </div>
      
      <div className="flex items-center pb-32">
        {/* Campo de pesquisa */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Pesquisar actividade" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[400px] h-20 pl-10 rounded-lg border-solid border border-gray-950/50 outline-0"
          />
          <LiaSearchSolid className="absolute right-4 top-1/2 transform -translate-y-1/2" size={"2rem"}/>
        </div>
        
        {/* Filtros */}
        <div className="ml-4 grid grid-cols-2 gap-4">
          <select 
            className="text-li-nav bg-white px-4 h-20 rounded-lg border-solid border border-gray-950/50 outline-0"
            value={filters.organizer}
            onChange={(e) => setFilters({...filters, organizer: e.target.value})}
          >
            <option value="">Todos Organizadores</option>
            <option value="Grupo de Jovens">Grupo de Jovens</option>
            <option value="Pastoral">Pastoral</option>
            {/* Adicione mais opções conforme necessário */}
          </select>
          
          <select 
            className="text-li-nav bg-white px-4 h-20 rounded-lg border-solid border border-gray-950/50 outline-0"
            value={filters.eventType}
            onChange={(e) => setFilters({...filters, eventType: e.target.value})}
          >
            <option value="">Todos Tipos de Evento</option>
            <option value="Retiro">Retiro</option>
            <option value="Palestra">Palestra</option>
            <option value="Missa">Missa</option>
            {/* Adicione mais opções conforme necessário */}
          </select>
          
          <select 
            className="text-li-nav bg-white px-4 h-20 rounded-lg border-solid border border-gray-950/50 outline-0"
            value={filters.theme}
            onChange={(e) => setFilters({...filters, theme: e.target.value})}
          >
            <option value="">Todos Temas</option>
            <option value="Espiritualidade">Espiritualidade</option>
            <option value="Comunidade">Comunidade</option>
            {/* Adicione mais opções conforme necessário */}
          </select>
          
          <select 
            className="text-li-nav bg-white px-4 h-20 rounded-lg border-solid border border-gray-950/50 outline-0"
            value={filters.targetAudience}
            onChange={(e) => setFilters({...filters, targetAudience: e.target.value})}
          >
            <option value="">Todos Públicos</option>
            <option value="Jovens">Jovens</option>
            <option value="Adultos">Adultos</option>
            <option value="Crianças">Crianças</option>
            {/* Adicione mais opções conforme necessário */}
          </select>
        </div>
      </div>
      
      {/* Lista de atividades filtradas */}
      <div className="activities-grid">
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <div key={activity.id} className="activity-card">
              <h3>{activity.title}</h3>
              <p>Organizador: {activity.organizer}</p>
              <p>Tipo: {activity.eventType}</p>
              <p>Tema: {activity.theme}</p>
              <p>Público: {activity.targetAudience}</p>
              <p>{activity.description}</p>
            </div>
          ))
        ) : (
          <p>Nenhuma atividade encontrada com os filtros selecionados.</p>
        )}
      </div>
    </section>
  );
};

export default ActivitiesSection;