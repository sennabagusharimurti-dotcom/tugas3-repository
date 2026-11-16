const { useState, useMemo } = React;

const initialProducts = [
  { id: 1, name: "Pulpen", price: 5000 },
  { id: 2, name: "Buku Tulis", price: 12000 },
  { id: 3, name: "Spidol", price: 8000 },
  { id: 4, name: "Penggaris", price: 6000 },
  { id: 5, name: "Penghapus", price: 3000 }
];

function formatRupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State Modal: 'tambah' | 'edit' | 'hapus' | null
  const [modalType, setModalType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");

  // Filter produk berdasarkan pencarian
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [products, searchQuery]);

  // Handler Buka Modal Tambah
  const openModalTambah = () => {
    setFormName("");
    setFormPrice("");
    setModalType("tambah");
  };

  // Handler Buka Modal Edit
  const openModalEdit = (product) => {
    setSelectedProduct(product);
    setFormName(product.name);
    setFormPrice(product.price);
    setModalType("edit");
  };

  // Handler Buka Modal Hapus
  const openModalHapus = (product) => {
    setSelectedProduct(product);
    setModalType("hapus");
  };

  // Handler Tutup Modal
  const closeModal = () => {
    setModalType(null);
    setSelectedProduct(null);
    setFormName("");
    setFormPrice("");
  };

  // Handler Simpan Tambah Produk
  const handleTambahSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || Number(formPrice) <= 0) return;

    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: formName.trim(),
      price: Number(formPrice)
    };

    setProducts([...products, newProduct]);
    closeModal();
  };

  // Handler Simpan Edit Produk
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || Number(formPrice) <= 0 || !selectedProduct) return;

    setProducts(
      products.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, name: formName.trim(), price: Number(formPrice) }
          : p
      )
    );
    closeModal();
  };

  // Handler Konfirmasi Hapus Produk
  const handleConfirmHapus = () => {
    if (!selectedProduct) return;
    setProducts(products.filter((p) => p.id !== selectedProduct.id));
    closeModal();
  };

  return (
    <div>
      {/* Konten Utama */}
      <main className="main-container">
        <div className="card app-card">
          
          {/* Header Aplikasi */}
          <div className="app-header">
            <div className="header-text">
              <h1>Manajemen Produk</h1>
              <p>Kelola daftar produk dan harga dalam satu tempat.</p>
            </div>
            <button className="btn btn-primary" onClick={openModalTambah}>
              <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/>
              </svg>
              Tambah Produk
            </button>
          </div>

          {/* Bar Pencarian & Total Produk */}
          <div className="search-bar-row">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/>
              </svg>
              <input
                type="text"
                placeholder="Cari nama produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="total-badge">{products.length} produk</span>
          </div>

          {/* Grid Daftar Produk */}
          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <p style={{ color: "#64748b", gridColumn: "1 / -1", textAlign: "center", padding: "24px" }}>
                Tidak ada produk yang ditemukan.
              </p>
            ) : (
              filteredProducts.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="product-id">ID: {p.id}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">{formatRupiah(p.price)}</div>
                  <div className="card-actions">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => openModalEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => openModalHapus(p)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Info */}
          <div className="product-footer-info">
            <span>
              Menampilkan {filteredProducts.length} dari {products.length} produk
            </span>
          </div>

        </div>
      </main>

      {/* ==================== MODAL TAMBAH PRODUK ==================== */}
      {modalType === "tambah" && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Tambah Produk</h3>
                <p className="modal-subtitle">Masukkan informasi produk baru.</p>
              </div>
              <button className="btn-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleTambahSubmit}>
              <div className="form-group">
                <label>Nama Produk</label>
                <input
                  type="text"
                  placeholder="Contoh: Pulpen"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Harga (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 5000"
                  min="1"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                />
                <small className="helper-text">Harga harus lebih dari 0.</small>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL EDIT PRODUK ==================== */}
      {modalType === "edit" && selectedProduct && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Edit Produk</h3>
                <p className="modal-subtitle">Perbarui informasi produk yang dipilih.</p>
              </div>
              <button className="btn-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="id-tag">ID: {selectedProduct.id}</div>
              <div className="form-group">
                <label>Nama Produk</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Harga (Rp)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                />
                <small className="helper-text">Harga harus lebih dari 0.</small>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL HAPUS PRODUK ==================== */}
      {modalType === "hapus" && selectedProduct && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box modal-confirm text-center" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close modal-close-top" onClick={closeModal}>&times;</button>
            
            <div className="trash-icon-wrapper">
              <svg className="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
              </svg>
            </div>

            <h3>Hapus Produk?</h3>
            <p className="modal-subtitle">Produk yang dihapus tidak dapat dikembalikan.</p>

            <div className="delete-preview-card">
              <span className="preview-id">ID: {selectedProduct.id}</span>
              <div className="preview-nama">{selectedProduct.name}</div>
              <div className="preview-harga">{formatRupiah(selectedProduct.price)}</div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={closeModal}>
                Batal
              </button>
              <button type="button" className="btn btn-danger" onClick={handleConfirmHapus}>
                Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Render ke Root DOM
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
