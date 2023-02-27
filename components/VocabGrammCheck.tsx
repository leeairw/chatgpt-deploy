'use client';

import { PlusIcon } from '@heroicons/react/24/solid'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/router' -- DO NOT USE
import { useRouter } from 'next/navigation'
import React from 'react'
import { db } from '../firebase';

type Props = {
    chatId: string;
}

function VocabGrammCheck({chatId}: Props) {
  const router = useRouter();
  const { data:session } = useSession();

  const createVocabGrammCheck = async() => {
    const doc = await addDoc(
        collection(db, 'users', session?.user?.email!, 'checks'), {
            userId: session?.user?.email!,
            createdAt:serverTimestamp()
        }
    );

    // router.push(`/check/${doc.id}`);
  };

  return (
    <div onClick={createVocabGrammCheck} className='border-gray-700 border pageButton'>
        <PlusIcon className='h-4 w-4'/>
        <p className='truncate'>Check Vocab & Grammar</p>
    </div>
  );
}

export default VocabGrammCheck;