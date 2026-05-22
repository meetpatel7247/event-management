import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ConfirmModal.module.css';

/**
 * Premium Reusable Confirm Modal Component
 * 
 * Replaces ugly browser-native confirm dialogs with a state-of-the-art
 * glassmorphic design system matching the rest of the dark-mode layout.
 * Supports multiple intent levels (e.g. "danger", "warning", "info").
 */
const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info" // info | warning | danger
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.backdrop}>
          {/* Dark Blurred Backdrop */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Modal Container */}
          <motion.div
            className={`${styles.modalContainer} ${styles[type]}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Visual Icon Header */}
            <div className={styles.iconWrapper}>
              {type === 'danger' && <span className={styles.icon}>🚨</span>}
              {type === 'warning' && <span className={styles.icon}>⚠️</span>}
              {type === 'info' && <span className={styles.icon}>✨</span>}
            </div>

            {/* Content Area */}
            <div className={styles.content}>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.message}>{message}</p>
            </div>

            {/* Buttons Row */}
            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={onCancel}>
                {cancelText}
              </button>
              <button 
                className={`${styles.confirmBtn} ${styles[`confirmBtn_${type}`]}`} 
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
