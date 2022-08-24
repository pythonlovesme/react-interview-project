import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Divider } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useGetList, useListContext } from 'react-admin';

type props = {
    statusTabLabel: { id: string; label: string }[];
    starTabLabel: { id: string; label: string }[];
};
const SlidableTabs = ({ statusTabLabel, starTabLabel }: props) => {
    const [params, setParams] = useSearchParams();
    const [valueOne, setValueOne] = React.useState(0);

    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;

    React.useEffect(() => {
        if (filterValues?.status) {
            params.set(
                'filter',
                JSON.stringify({ ...filterValues, rating: null })
            );
            setParams(params);
        }
    }, [params]);

    React.useEffect(() => {
        if (!filterValues?.status) {
            setFilters(
                {
                    ...filterValues,
                    rating: valueOne + 1,
                    status: null,
                },
                displayedFilters,
                false
            );
        }
    }, [valueOne, params]);

    const useGetStatusTotals = (filterValues: any) => {
        const { total: totalPending } = useGetList('reviews', {
            pagination: { perPage: 1, page: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: { ...filterValues, status: 'pending' },
        });
        const { total: totalAccepted } = useGetList('reviews', {
            pagination: { perPage: 1, page: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: { ...filterValues, status: 'accepted' },
        });
        const { total: totalRejected } = useGetList('reviews', {
            pagination: { perPage: 1, page: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: { ...filterValues, status: 'rejected' },
        });

        return {
            PENDING: totalPending,
            ACCEPTED: totalAccepted,
            REJECTED: totalRejected,
        };
    };

    const useGetStarTotals = (filterValues: any) => {
        const { total: totalOneStar } = useGetList('reviews', {
            pagination: { perPage: 1, page: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: { ...filterValues, rating: '1' },
        });
        const { total: totalTwoStar } = useGetList('reviews', {
            pagination: { perPage: 1, page: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: { ...filterValues, rating: '2' },
        });
        const { total: totalThreeStar } = useGetList('reviews', {
            pagination: { perPage: 1, page: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: { ...filterValues, rating: '3' },
        });
        const { total: totalFourStar } = useGetList('reviews', {
            pagination: { perPage: 1, page: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: { ...filterValues, rating: '4' },
        });
        const { total: totalFiveStar } = useGetList('reviews', {
            pagination: { perPage: 1, page: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: { ...filterValues, rating: '5' },
        });

        return {
            '1 STAR': totalOneStar,
            '2 STAR': totalTwoStar,
            '3 STAR': totalThreeStar,
            '4 STAR': totalFourStar,
            '5 STAR': totalFiveStar,
        };
    };

    const statusTotals = useGetStatusTotals(filterValues) as any;
    const starTotals = useGetStarTotals(filterValues) as any;

    const getTabValues = (value: number) => {
        switch (value) {
            case 0:
                return 'pending';
            case 1:
                return 'accepted';
            default:
                return 'rejected';
        }
    };

    const getStatusTabs = (status: string) => {
        switch (status) {
            case 'pending':
                return 0;
            case 'accepted':
                return 1;
            default:
                return 2;
        }
    };

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<{}>, value: number) => {
            setFilters &&
                setFilters(
                    {
                        ...filterValues,
                        status: getTabValues(value),
                        rating: null,
                    },
                    displayedFilters,
                    false
                );
        },
        [displayedFilters, filterValues, setFilters]
    );

    const handleChangeStar = React.useCallback(
        (event: React.ChangeEvent<{}>, value: number) => {
            setValueOne(value);
            setFilters &&
                setFilters(
                    {
                        ...filterValues,
                        rating: value + 1,
                        status: null,
                    },
                    displayedFilters,
                    false
                );
        },
        [displayedFilters, filterValues, setFilters]
    );

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {filterValues?.status ? (
                <Tabs
                    value={getStatusTabs(filterValues.status)}
                    onChange={handleChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                >
                    {statusTabLabel?.map(item => {
                        return (
                            <Tab
                                key={item.id}
                                label={
                                    statusTotals[item?.label]
                                        ? `${item?.label} (${
                                              statusTotals[item?.label]
                                          })`
                                        : item?.label
                                }
                            />
                        );
                    })}
                </Tabs>
            ) : (
                <Tabs
                    value={parseInt(filterValues.rating) - 1}
                    onChange={handleChangeStar}
                    variant="fullWidth"
                    indicatorColor="primary"
                >
                    {starTabLabel?.map(item => {
                        return (
                            <Tab
                                key={item.id}
                                label={
                                    starTotals[item?.label]
                                        ? `${item?.label} (${
                                              starTotals[item?.label]
                                          })`
                                        : item?.label
                                }
                            />
                        );
                    })}
                </Tabs>
            )}
            <Divider />
        </Box>
    );
};
export default SlidableTabs;
