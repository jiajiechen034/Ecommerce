import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../config/api';

function TransactionHistoryPage({ currentUser }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser?.email) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError('');

      try {
        const encodedEmail = encodeURIComponent(currentUser.email);
        const res = await fetch(
          `${API_BASE_URL}/api/transactions/history?userEmail=${encodedEmail}`
        );

        if (!res.ok) {
          const errMessage = await res.text();
          throw new Error(errMessage || 'Failed to load transaction history');
        }

        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="history-page">
        <h2>Transaction History</h2>
        <p className="history-empty">Please login to view your transactions.</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-page-header">
        <h2>Transaction History</h2>
        <p className="history-page-subtitle">{currentUser.email}</p>
      </div>

      {loading && <p className="loading-message">Loading history...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && history.length === 0 && (
        <p className="history-empty">No transactions yet.</p>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="history-list">
          {history.map((transaction) => (
            <article key={transaction.id} className="history-card">
              <div className="history-card-header">
                <div>
                  <p className="history-meta">Transaction #{transaction.id}</p>
                  <p className="history-date">
                    {transaction.createdAt
                      ? new Date(transaction.createdAt).toLocaleString()
                      : 'Unknown date'}
                  </p>
                </div>

                <p className="history-total">
                  ${Number(transaction.totalAmount || 0).toFixed(2)}
                </p>
              </div>

              <div className="history-items">
                {(transaction.items || []).map((item, index) => (
                  <div className="history-item-row" key={`${transaction.id}-${item.productId}-${index}`}>
                    <div>
                      <p className="history-item-name">{item.productName || 'Unknown product'}</p>
                      <p className="history-item-meta">
                        Qty {item.quantity || 0} x ${Number(item.unitPrice || 0).toFixed(2)}
                      </p>
                    </div>

                    <strong>
                      ${Number(item.lineTotal || 0).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

TransactionHistoryPage.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
  }),
};

export default TransactionHistoryPage;