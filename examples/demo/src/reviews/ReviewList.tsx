import * as React from 'react';
import { useCallback } from 'react';
import { List } from 'react-admin';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Box, Drawer, useMediaQuery, Theme } from '@mui/material';

import ReviewListMobile from './ReviewListMobile';
import ReviewListDesktop from './ReviewListDesktop';
import reviewFilters from './reviewFilters';
import ReviewEdit from './ReviewEdit';
import SlidableTabs from './SlidableTabs';

const ratingTabLabel = [
    { id: '1 STAR', label: '1 STAR' },
    { id: '2 STAR', label: '2 STAR' },
    { id: '3 STAR', label: '3 STAR' },
    { id: '4 STAR', label: '4 STAR' },
    { id: '5 STAR', label: '5 STAR' },
];

const statusTabLabel = [
    { id: 'PENDING', label: 'PENDING' },
    { id: 'ACCEPTED', label: 'ACCEPTED' },
    { id: 'REJECTED', label: 'REJECTED' },
];

const ReviewList = () => {
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const location = useLocation();
    const navigate = useNavigate();

    const handleClose = useCallback(() => {
        navigate('/reviews');
    }, [navigate]);

    const match = matchPath('/reviews/:id', location.pathname);

    return (
        <Box display="flex">
            <List
                sx={{
                    flexGrow: 1,
                    transition: (theme: any) =>
                        theme.transitions.create(['all'], {
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    marginRight: !!match ? '400px' : 0,
                }}
                filters={reviewFilters}
                perPage={25}
                sort={{ field: 'date', order: 'DESC' }}
            >
                {isXSmall ? (
                    <ReviewListMobile />
                ) : (
                    <>
                        <SlidableTabs
                            statusTabLabel={statusTabLabel}
                            starTabLabel={ratingTabLabel}
                        />
                        <ReviewListDesktop
                            selectedRow={
                                !!match
                                    ? parseInt((match as any).params.id, 10)
                                    : undefined
                            }
                        />
                    </>
                )}
            </List>
            <Drawer
                variant="persistent"
                open={!!match}
                anchor="right"
                onClose={handleClose}
                sx={{ zIndex: 100 }}
            >
                {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
                {!!match && (
                    <ReviewEdit
                        id={(match as any).params.id}
                        onCancel={handleClose}
                    />
                )}
            </Drawer>
        </Box>
    );
};

export default ReviewList;
