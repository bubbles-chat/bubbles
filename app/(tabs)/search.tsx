import { ActivityIndicator, FlatList, StyleSheet, useColorScheme } from 'react-native'
import { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import CustomTextInput from '@/components/CustomTextInput'
import { InputState } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { Colors } from '@/constants/Colors'
import User from '@/models/User.model'
import useDebounce from '@/hooks/useDebounce'
import { getUserByUsername } from '@/api/userApi'
import { AxiosError } from 'axios'
import UserFlatListItem from '@/components/UserFlatListItem'
import UserListEmptyComponent from '@/components/UserListEmptyComponent'
import { addRequest } from '@/api/requestApi'
import showToast from '@/components/Toast'
import { useIsFocused } from '@react-navigation/native'

const Search = () => {
    const [search, setSearch] = useState<InputState>({
        value: '',
        isFocused: false
    })
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(0)

    const isFocused = useIsFocused()
    const headerHeight = useHeaderHeight()
    const colorScheme = useColorScheme()

    const handleSearchOnChangeText = (text: string): void => {
        setSearch((prev) => ({
            ...prev,
            value: text
        }))
    }

    const handleSearchOnFocus = (): void => {
        setSearch(prev => ({
            ...prev,
            isFocused: true
        }))
    }

    const handleSearchOnBlur = (): void => {
        setSearch(prev => ({
            ...prev,
            isFocused: false
        }))
    }

    const handleFlatListOnEndReached = async () => {
        if (hasMore) {
            await fetchUsersOnEndReached(page + 1)
            setPage(prev => prev + 1)
        }
    }

    const handleOnPressAdd = async (id: string) => {
        try {
            const response = await addRequest(id)

            if (response.status === 201) {
                setUsers(prev => prev.filter(user => user._id !== id))
                showToast('Request has been sent')
            }
        } catch (e) {
            const err = e as AxiosError

            console.error('handleAddOnPress:', err.response?.data);
        }
    }

    const fetchUsersBasedOnSearchValue = async () => {
        setIsLoading(true)
        setHasMore(true)
        setPage(0)

        const limit = 10

        try {
            if (search.value.length > 0 && isFocused) {
                
                const response = await getUserByUsername(search.value, limit, 0)
                const { users } = response.data

                if (users.length < limit) {
                    setHasMore(false)
                }

                setUsers(users)
            }
        } catch (e) {
            const err = e as AxiosError
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchUsersOnEndReached = async (page = 0) => {
        setIsLoading(true)

        const limit = 10
        const skip = page * limit

        try {
            if (search.value.length > 0) {
                const response = await getUserByUsername(search.value, limit, skip)
                const { users } = response.data

                if (users.length < limit) {
                    setHasMore(false)
                }

                setUsers(prev => [...prev, ...users])
            }
        } catch (e) {
            const err = e as AxiosError
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useDebounce(fetchUsersBasedOnSearchValue, [search.value, isFocused], 800)

    useEffect(() => {
        if (search.value.length === 0) {
            setUsers([])
            setPage(0)
            setHasMore(true)
        }
    }, [search.value])

    return (
        <ThemedView style={[styles.container, { paddingTop: headerHeight + 16 }]}>
            <CustomTextInput
                state={search}
                Icon={<Ionicons
                    name='search'
                    size={18}
                    color={colorScheme === 'dark' ? Colors.dark.text : Colors.light.text}
                />}
                placeholder='Enter a username'
                onChangeText={handleSearchOnChangeText}
                onFocus={handleSearchOnFocus}
                onBlur={handleSearchOnBlur}
                keyboardAppearance='default'
            />
            <FlatList
                data={users}
                renderItem={({ item }) => <UserFlatListItem item={item} onPressAdd={async () => await handleOnPressAdd(item._id)} />}
                keyExtractor={(item, _) => item._id}
                onEndReached={handleFlatListOnEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoading ? <ActivityIndicator size={'large'} /> : null}
                ListEmptyComponent={<UserListEmptyComponent query={search.value} />}
                contentContainerStyle={styles.flatListContainer}
                keyboardDismissMode='on-drag'
            />
        </ThemedView>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8
    },
    flatListContainer: {
        flexGrow: 1
    }
})