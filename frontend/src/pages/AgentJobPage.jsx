import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeliveryById, submitProofOfDelivery } from '../../redux/slices/deliverySlice';
import toast from 'react-hot-toast';
import './AgentPages.css';

const AgentJobPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedDelivery: delivery, loading } = useSelector((state) => state.delivery);
    const [proof, setProof] = useState('');
    const [recipientName, setRecipientName] = useState('');

    useEffect(() => {
        dispatch(fetchDeliveryById(id));
    }, [dispatch, id]);

    const handleSubmitProof = async (e) => {
        e.preventDefault();
        if (!proof.trim() || !recipientName.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        try {
            await dispatch(submitProofOfDelivery({ id, proofOfDelivery: proof, recipientName })).unwrap();
            toast.success('Proof of delivery submitted!');
        } catch (err) {
            toast.error('Failed to submit proof');
        }
    };

    if (loading || !delivery) {
        return (
            <div className="agent-page">
                <div className="container"><div className="loading-state"><div className="spinner"></div></div></div>
            </div>
        );
    }

    const isCompleted = delivery.status === 'delivered';

    return (
        <div className="agent-page">
            <div className="container">
                <div className="agent-job-header">
                    <Link to="/agent" className="back-link">← Back to Dashboard</Link>
                    <h1>Delivery Job #{delivery.id}</h1>
                    <span className={`delivery-status status-${delivery.status}`}>{delivery.status.replace('_', ' ')}</span>
                </div>

                <div className="job-content">
                    <div className="job-card">
                        <h3>Delivery Details</h3>
                        <p><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> {delivery.deliveryAddress}</p>
                        <p><i className="fas fa-phone"></i> <strong>Phone:</strong> {delivery.deliveryPhone}</p>
                        {delivery.deliveryInstructions && (
                            <p><i className="fas fa-info-circle"></i> <strong>Instructions:</strong> {delivery.deliveryInstructions}</p>
                        )}
                        <p><i className="fas fa-money-bill-wave"></i> <strong>Fee:</strong> KES {delivery.deliveryFee}</p>
                    </div>

                    {!isCompleted ? (
                        <form onSubmit={handleSubmitProof} className="proof-form">
                            <h3>Complete Delivery</h3>
                            <div className="form-group">
                                <label>Recipient Name *</label>
                                <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Enter recipient name" required />
                            </div>
                            <div className="form-group">
                                <label>Proof of Delivery *</label>
                                <textarea value={proof} onChange={e => setProof(e.target.value)} placeholder="Describe delivery confirmation (e.g., photo taken, signed receipt, etc.)" required rows="4" />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg">Submit Proof & Complete</button>
                        </form>
                    ) : (
                        <div className="completed-banner">
                            <i className="fas fa-check-circle"></i>
                            <h3>Delivery Completed</h3>
                            <p>Proof: {delivery.proofOfDelivery}</p>
                            {delivery.recipientName && <p>Recipient: {delivery.recipientName}</p>}
                            {delivery.deliveredAt && <p>Completed: {new Date(delivery.deliveredAt).toLocaleString()}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentJobPage;
