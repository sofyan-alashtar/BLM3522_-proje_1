import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/userContext';
import EmptyState from '../EmptyState';
import Container from '../Container';
import Heading from '../Heading';
import ListingCard from '../listings/ListingCard'; 
import { getListingsForUser, deleteListing } from '../../utils/listing';
import toast from 'react-hot-toast';
import Loading from '../Loading';
import Error from '../Error';

function Properties() {
  const { currentUser } = useContext(UserContext);
  const [listings, setListings] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (currentUser) {
        setIsLoading(true);
        setError(null);
        try {
          const userListings = await getListingsForUser(currentUser.id, localStorage.getItem('token'));
          setListings(userListings);
        } catch (err) {
          setError(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchListings();
  }, [currentUser]);

  const onCancel = useCallback((listingId) => {
    const token = localStorage.getItem('token');
    setDeletingId(listingId);
    try {
      deleteListing(listingId, token)
        .then(() => {
          setListings((prevListings) => prevListings.filter((listing) => listing.id !== listingId));
          toast.success('Mülk başarıyla silindi');
        })
        .catch(() => {
          toast.error('Mülk silinirken bir hata oluştu');
        });
    } catch (err) {
      console.error('Mülk silinirken bir hata oluştu:', err.message);
      toast.error('Beklenmeyen bir hata oluştu');
    } finally {
      setDeletingId(null);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <EmptyState title="Yetkisiz" subtitle="Lütfen giriş yapın" />;
  }

  if (listings.length === 0) {
    return <EmptyState title="Hiçbir mülk bulunamadı" subtitle="Görünüşe göre hiçbir mülkünüz yok" />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return (
    <Container>
      <Heading title="Mülkler" subtitle="Mülklerinizin listesi" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onCancel}
            disabled={deletingId === listing.id}
            actionLabel="Mülkü sil"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
}

export default Properties;
