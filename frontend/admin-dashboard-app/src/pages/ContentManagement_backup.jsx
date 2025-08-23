import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit, FiTrash, FiStar, FiUpload, FiPlay, FiFilm } from 'react-icons/fi';
import { contentAPI } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateTime, debounce } from '../utils/helpers';
import { toast } from 'react-toastify';
import './ContentManagement.scss';

const ContentManagement = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: 'all', genre: 'all', featured: 'all' });
  const [selectedContent, setSelectedContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'edit', 'delete', 'feature'

  useEffect(() => {
    fetchContent();
  }, [filters]);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      fetchContent();
    }, 500);
    
    debouncedSearch();
  }, [searchTerm]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Try to fetch real content from the API
      const response = await contentAPI.getAll({ 
        search: searchTerm,
        type: filters.type,
        genre: filters.genre,
        featured: filters.featured 
      });
      
      // Transform backend data to match frontend expectations
      const transformedContent = response.data.map(item => ({
        id: item._id,
        title: item.title,
        type: item.isSeries ? 'series' : 'movie',
        genre: item.genre,
        year: item.year,
        duration: item.duration || null,
        seasons: item.seasons || null,
        episodes: item.episodes || null,
        rating: item.rating || 0,
        featured: item.featured || false,
        createdAt: item.createdAt,
        views: item.views || 0,
        thumbnail: item.img || item.imgSm || '/api/placeholder/300/400',
        description: item.desc || item.description,
        video: item.video,
        trailer: item.trailer
      }));
      
      setContent(transformedContent);
      
    } catch (error) {
      console.error('Fetch content error:', error);
      toast.error('Failed to fetch content from database');
      
      // Fallback to mock data if API fails
      setContent([
        {
          id: 1,
          title: 'Inception',
          type: 'movie',
          genre: 'Sci-Fi',
          year: 2010,
          duration: 148,
          rating: 8.8,
          featured: true,
          createdAt: new Date().toISOString(),
          views: 15420,
          thumbnail: '/api/placeholder/300/400'
        },
        {
          id: 2,
          title: 'Breaking Bad',
          type: 'series',
          genre: 'Drama',
          year: 2008,
          duration: null,
          seasons: 5,
          episodes: 62,
          rating: 9.5,
          featured: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          views: 28930,
          thumbnail: '/api/placeholder/300/400'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleContentAction = async (action, contentItem) => {
    try {
      switch (action) {
        case 'feature':
          await contentAPI.setFeatured(contentItem.id, !contentItem.featured);
          setContent(prevContent => 
            prevContent.map(item => 
              item.id === contentItem.id 
                ? { ...item, featured: !item.featured }
                : item
            )
          );
          toast.success(`${contentItem.title} ${contentItem.featured ? 'removed from' : 'added to'} featured content`);
          break;
        case 'delete':
          await contentAPI.delete(contentItem.id);
          setContent(prevContent => 
            prevContent.filter(item => item.id !== contentItem.id)
          );
          toast.success(`${contentItem.title} has been deleted`);
          break;
        case 'edit':
          toast.info(`Edit mode for ${contentItem.title} (feature coming soon)`);
          break;
        case 'create':
          toast.info('Create content functionality (feature coming soon)');
          break;
        default:
          break;
      }
      
      setShowModal(false);
      setSelectedContent(null);
    } catch (error) {
      console.error(`${action} content error:`, error);
      toast.error(`Failed to ${action} content. ${error.response?.data?.error || error.message}`);
    }
  };

  const openModal = (type, contentItem) => {
    setModalType(type);
    setSelectedContent(contentItem);
    setShowModal(true);
  };

  const getFeaturedBadge = (featured) => {
    return featured ? (
      <span className="featured-badge">
        <FiStar /> Featured
      </span>
    ) : null;
  };

  const getTypeIcon = (type) => {
    return type === 'movie' ? <FiFilm /> : <FiPlay />;
  };

  const filteredContent = content.filter(item => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = item.title?.toLowerCase().includes(searchLower);
      const genreMatch = item.genre?.toLowerCase().includes(searchLower);
      const yearMatch = item.year?.toString().includes(searchTerm);
      if (!titleMatch && !genreMatch && !yearMatch) return false;
    }
    
    // Type filter
    if (filters.type !== 'all' && item.type !== filters.type) return false;
    
    // Genre filter
    if (filters.genre !== 'all' && item.genre !== filters.genre) return false;
    
    // Featured filter
    if (filters.featured !== 'all') {
      const isFeatured = filters.featured === 'featured';
      if (item.featured !== isFeatured) return false;
    }
    
    return true;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ type: 'all', genre: 'all', featured: 'all' });
  };

  // Get unique genres from content
  const uniqueGenres = [...new Set(content.map(item => item.genre).filter(Boolean))];

  return (
    <div className="content-management">
      <div className="page-header">
        <div className="header-left">
          <h1>Content Management</h1>
          <p>Manage movies, series, and platform content</p>
        </div>
        <div className="header-right">
          <Button icon={<FiPlus />} onClick={() => openModal('create', null)}>
            Add Content
          </Button>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, genre, or year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-group">
          <span className="filter-label">Type:</span>
          <select 
            value={filters.type} 
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="movie">🎬 Movies</option>
            <option value="series">📺 Series</option>
          </select>
          
          <span className="filter-label">Genre:</span>
          <select 
            value={filters.genre} 
            onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Genres</option>
            {uniqueGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
            <option value="Horror">Horror</option>
            <option value="Romance">Romance</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Crime">Crime</option>
            <option value="Adventure">Adventure</option>
          </select>
          
          <span className="filter-label">Status:</span>
          <select 
            value={filters.featured} 
            onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Content</option>
            <option value="featured">⭐ Featured</option>
            <option value="normal">📋 Normal</option>
          </select>
          
          {(searchTerm || filters.type !== 'all' || filters.genre !== 'all' || filters.featured !== 'all') && (
            <button onClick={clearFilters} className="clear-filters">
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Content Statistics */}
      <div className="content-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{filteredContent.length}</div>
          <div className="stat-label">Total Content</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎬</div>
          <div className="stat-value">{filteredContent.filter(item => item.type === 'movie').length}</div>
          <div className="stat-label">Movies</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📺</div>
          <div className="stat-value">{filteredContent.filter(item => item.type === 'series').length}</div>
          <div className="stat-label">Series</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{filteredContent.filter(item => item.featured).length}</div>
          <div className="stat-label">Featured</div>
        </div>
      </div>
            <div className="stat-item">
              <span className="stat-label">Movies:</span>
              <span className="stat-value">{content.filter(item => item.type === 'movie').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Series:</span>
              <span className="stat-value">{content.filter(item => item.type === 'series').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Featured:</span>
              <span className="stat-value">{content.filter(item => item.featured).length}</span>
            </div>
          </div>

          <div className="content-grid">
            {filteredContent.map((item) => (
              <div key={item.id} className="content-card">
                <div className="content-thumbnail">
                  <img 
                    src={item.thumbnail || '/api/placeholder/300/400'} 
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMjEyMTIxIi8+CjxwYXRoIGQ9Ik0xMjAgMTgwSDkyVjIyMEgxMjBWMTgwWiIgZmlsbD0iIzNBM0EzQSIvPgo8cGF0aCBkPSJNMjA4IDE4MEgxODBWMjIwSDIwOFYxODBaIiBmaWxsPSIjM0EzQTNBIi8+CjxwYXRoIGQ9Ik0xNjQgMjIwSDEzNlYyNDBIMTY0VjIyMFoiIGZpbGw9IiMzQTNBM0EiLz4KPC9zdmc+';
                    }}
                  />
                  <div className="content-overlay">
                    <div className="content-type">
                      {getTypeIcon(item.type)}
                      <span>{item.type}</span>
                    </div>
                    {getFeaturedBadge(item.featured)}
                  </div>
                </div>
                
                <div className="content-info">
                  <h3 className="content-title">{item.title}</h3>
                  <div className="content-meta">
                    <span className="genre">{item.genre}</span>
                    <span className="year">{item.year}</span>
                    <span className="rating">⭐ {item.rating}</span>
                  </div>
                  
                  <div className="content-details">
                    {item.type === 'movie' ? (
                      <span>{item.duration}min</span>
                    ) : (
                      <span>{item.seasons} seasons • {item.episodes} episodes</span>
                    )}
                    <span>{item.views?.toLocaleString()} views</span>
                  </div>
                  
                  <div className="content-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => openModal('edit', item)}
                      title="Edit Content"
                    >
                      <FiEdit />
                    </button>
                    
                    <button 
                      className={`action-btn feature ${item.featured ? 'featured' : ''}`}
                      onClick={() => openModal('feature', item)}
                      title={item.featured ? 'Remove from Featured' : 'Add to Featured'}
                    >
                      <FiStar />
                    </button>
                    
                    <button 
                      className="action-btn delete"
                      onClick={() => openModal('delete', item)}
                      title="Delete Content"
                    >
                      <FiTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredContent.length === 0 && (
            <div className="empty-state">
              <FiSearch className="empty-icon" />
              <p>No content found matching your criteria</p>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Content`}
          footer={
            selectedContent && (
              <div className="modal-actions">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant={modalType === 'delete' ? 'danger' : 'primary'}
                  onClick={() => handleContentAction(modalType, selectedContent)}
                >
                  {modalType === 'feature' 
                    ? (selectedContent.featured ? 'Remove from Featured' : 'Add to Featured')
                    : modalType.charAt(0).toUpperCase() + modalType.slice(1)
                  }
                </Button>
              </div>
            )
          }
        >
          <div className="modal-content">
            {modalType === 'delete' && selectedContent && (
              <p>Are you sure you want to delete <strong>{selectedContent.title}</strong>? This action cannot be undone.</p>
            )}
            {modalType === 'feature' && selectedContent && (
              <p>
                {selectedContent.featured 
                  ? `Remove "${selectedContent.title}" from featured content?`
                  : `Add "${selectedContent.title}" to featured content?`
                }
              </p>
            )}
            {modalType === 'edit' && selectedContent && (
              <div className="edit-form">
                <p>Edit functionality would be implemented here with a comprehensive form for updating content details, uploading thumbnails, etc.</p>
              </div>
            )}
            {modalType === 'create' && (
              <div className="create-form">
                <p>Add content functionality would be implemented here with forms for adding new movies/series, file uploads, etc.</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContentManagement;
