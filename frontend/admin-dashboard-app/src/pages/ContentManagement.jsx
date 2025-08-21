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
      const params = {
        search: searchTerm,
        type: filters.type,
        genre: filters.genre,
        featured: filters.featured,
        limit: 50
      };
      
      const response = await contentAPI.getAll(params);
      setContent(response.data.content || []);
    } catch (error) {
      console.error('Fetch content error:', error);
      // Set mock data for demo
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
        },
        {
          id: 3,
          title: 'The Dark Knight',
          type: 'movie',
          genre: 'Action',
          year: 2008,
          duration: 152,
          rating: 9.0,
          featured: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          views: 21870,
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
          toast.success(`${contentItem.title} ${contentItem.featured ? 'removed from' : 'added to'} featured content`);
          break;
        case 'delete':
          await contentAPI.delete(contentItem.id);
          toast.success(`${contentItem.title} has been deleted`);
          break;
        default:
          break;
      }
      
      fetchContent();
      setShowModal(false);
      setSelectedContent(null);
    } catch (error) {
      console.error(`${action} content error:`, error);
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
    if (filters.type !== 'all' && item.type !== filters.type) return false;
    if (filters.genre !== 'all' && item.genre !== filters.genre) return false;
    if (filters.featured !== 'all') {
      const isFeatured = filters.featured === 'featured';
      if (item.featured !== isFeatured) return false;
    }
    return true;
  });

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

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search content by title, genre, or year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select 
            value={filters.type} 
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
          </select>
          
          <select 
            value={filters.genre} 
            onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Genres</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Horror">Horror</option>
            <option value="Romance">Romance</option>
          </select>
          
          <select 
            value={filters.featured} 
            onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Content</option>
            <option value="featured">Featured Only</option>
            <option value="not-featured">Not Featured</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <LoadingSpinner text="Loading content..." />
      ) : (
        <>
          <div className="content-stats">
            <div className="stat-item">
              <span className="stat-label">Total Content:</span>
              <span className="stat-value">{content.length}</span>
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
