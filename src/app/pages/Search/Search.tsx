import React, { useState } from 'react';
import styles from './Search.module.css';
import type { Credential } from '../../../types';
import CredentialCard from '../../components/CredentialCard/CredentialCard';
import { Link } from 'react-router-dom';
import { deleteCredential } from '../../../utils/api';

export default function Search(): JSX.Element {
  const [service, setService] = useState<string>('');
  const [masterPassword, setMasterPassword] = useState<string>('');
  const [credential, setCredential] = useState<Credential | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/credentials/${service}`, {
      headers: { Authorization: masterPassword },
    });
    if (!response.ok) {
      setIsError(true);
      console.log('Credential not found');
      return;
    }
    setIsError(false);
    const credential: Credential = await response.json();
    setCredential(credential);
  }

  async function handleDeleteClick(service: string) {
    await deleteCredential(service, masterPassword);
    setCredential(null);
    setIsError(false);
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.header}>Vault</h1>
      {credential ? (
        <>
          <CredentialCard
            credential={credential}
            onDeleteClick={handleDeleteClick}
          />
          <Link to="/">Back to Dashboard</Link>
        </>
      ) : (
        <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
          <input
            type="text"
            placeholder="Service"
            value={service}
            onChange={(event) => setService(event.target.value)}
          />
          <input
            type="password"
            placeholder="Master Password"
            value={masterPassword}
            onChange={(event) => setMasterPassword(event.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
      )}
      {isError && <p className={styles.error}>Something went wrong!</p>}
      <Link to="/">Return to Dashboard</Link>
    </main>
  );
}
